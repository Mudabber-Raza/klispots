import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testS3Connectivity, testCORSAccess } from '@/utils/SmartVenueImageV2';
import venueMappings from '@/data/venue-image-mappings.json';

export const ImageSystemDebugger: React.FC = () => {
  const [s3Status, setS3Status] = useState<{ connected: boolean; error?: string } | null>(null);
  const [corsStatus, setCorsStatus] = useState<{ corsWorking: boolean; error?: string } | null>(null);
  const [testResults, setTestResults] = useState<Array<{
    category: string;
    placeId: string;
    placeName?: string;
    fileName: string;
    testUrl: string;
    fetchStatus: string | number;
    imageLoads: boolean;
    success: boolean;
    error: string | null;
  }>>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingCors, setIsTestingCors] = useState(false);
  const [isTestingImages, setIsTestingImages] = useState(false);

  const testConnectivity = async () => {
    setIsTesting(true);
    try {
      const result = await testS3Connectivity();
      setS3Status(result);
    } catch (error) {
      setS3Status({ connected: false, error: 'Test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const testCors = async () => {
    setIsTestingCors(true);
    try {
      const result = await testCORSAccess();
      setCorsStatus(result);
    } catch (error) {
      setCorsStatus({ corsWorking: false, error: 'CORS test failed' });
    } finally {
      setIsTestingCors(false);
    }
  };

  // Test random images from each category
  const testRandomImages = async () => {
    setIsTestingImages(true);
    setTestResults([]);
    
    const categories = ['restaurants', 'cafes', 'shopping', 'entertainment', 'arts-culture', 'health-wellness', 'sports-fitness'];
    const results: Array<{
      category: string;
      placeId: string;
      placeName?: string;
      fileName: string;
      testUrl: string;
      fetchStatus: string | number;
      imageLoads: boolean;
      success: boolean;
      error: string | null;
    }> = [];
    
    for (const category of categories) {
      console.log(`🔍 Testing category: ${category}`);
      
      // Get random place IDs for this category
      const placeIds = Object.keys(venueMappings.placeIdMappings || {});
      const randomPlaceIds = placeIds.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      for (const placeId of randomPlaceIds) {
        const s3FolderName = venueMappings.placeIdMappings[placeId];
        const placeName = Object.keys(venueMappings.placeNameMappings).find(name => 
          venueMappings.placeNameMappings[name] === s3FolderName
        );
        
        // Test different image numbers
        const imageNumbers = ['_1.jpg', '_2.jpg', '_3.jpg'];
        
        for (const imageNumber of imageNumbers) {
          const fileName = `${s3FolderName}${imageNumber}`;
          const testUrl = `https://klispots-venue-images.s3.eu-north-1.amazonaws.com/google_places_images1/${s3FolderName}/${fileName}`;
          
          try {
            // Test with fetch first
            const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
            const status = response.status || 'no-cors';
            
            // Test with image element
            const img = new Image();
            const imageLoads = await new Promise<boolean>((resolve) => {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.crossOrigin = 'anonymous';
              img.src = testUrl;
              setTimeout(() => resolve(false), 3000);
            });
            
            results.push({
              category,
              placeId,
              placeName,
              fileName,
              testUrl,
              fetchStatus: status,
              imageLoads,
              success: imageLoads,
              error: imageLoads ? null : 'Image failed to load'
            });
            
            console.log(`✅ Tested: ${category}/${fileName} - Status: ${status}, Image Loads: ${imageLoads}`);
            
          } catch (error) {
            results.push({
              category,
              placeId,
              placeName,
              fileName,
              testUrl,
              fetchStatus: 'error',
              imageLoads: false,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            console.log(`❌ Tested: ${category}/${fileName} - Error: ${error}`);
          }
        }
      }
    }
    
    setTestResults(results);
    setIsTestingImages(false);
    
    // Log summary
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    console.log(`📊 Test Summary: ${successCount}/${totalCount} images loaded successfully`);
  };

  // Test fuzzy name matching specifically
  const testFuzzyMatching = async () => {
    setIsTestingImages(true);
    setTestResults([]);
    
    // Test venues that don't have place IDs but should work with fuzzy name matching
    const testVenues = [
      { category: 'shopping', name: 'Packages Mall' },
      { category: 'shopping', name: 'Dolmen Mall' },
      { category: 'entertainment', name: 'Cinepax' },
      { category: 'arts-culture', name: 'National Art Gallery' },
      { category: 'health-wellness', name: 'Aashiana Shopping Center' }
    ];
    
    const results: Array<{
      category: string;
      placeId: string;
      placeName?: string;
      fileName: string;
      testUrl: string;
      fetchStatus: string | number;
      imageLoads: boolean;
      success: boolean;
      error: string | null;
    }> = [];
    
    for (const venue of testVenues) {
      console.log(`🔍 Testing fuzzy matching for: ${venue.category}/${venue.name}`);
      
      // Try to find similar names in venue mappings
      const similarNames = Object.keys(venueMappings.placeNameMappings || {}).filter(name =>
        name.toLowerCase().includes(venue.name.toLowerCase()) ||
        venue.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().replace(/[^a-z0-9]/g, '') === venue.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      
      console.log(`🔍 Found ${similarNames.length} similar names for ${venue.name}:`, similarNames.slice(0, 3));
      
      for (const similarName of similarNames.slice(0, 3)) {
        const s3FolderName = venueMappings.placeNameMappings[similarName];
        const baseFolder = 'google_places_images1';
        
        // Test different image numbers
        const imageNumbers = ['_1.jpg', '_2.jpg', '_3.jpg'];
        
        for (const imageNumber of imageNumbers) {
          const fileName = `${s3FolderName}${imageNumber}`;
          const testUrl = `https://klispots-venue-images.s3.eu-north-1.amazonaws.com/${baseFolder}/${s3FolderName}/${fileName}`;
          
          try {
            // Test with fetch first
            const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
            const status = response.status || 'no-cors';
            
            // Test with image element
            const img = new Image();
            const imageLoads = await new Promise<boolean>((resolve) => {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.crossOrigin = 'anonymous';
              img.src = testUrl;
              setTimeout(() => resolve(false), 3000);
            });
            
            results.push({
              category: venue.category,
              placeId: similarName,
              placeName: venue.name,
              fileName,
              testUrl,
              fetchStatus: status,
              imageLoads,
              success: imageLoads,
              error: imageLoads ? null : 'Image failed to load'
            });
            
            console.log(`✅ Fuzzy test: ${venue.category}/${venue.name} → ${similarName} - Status: ${status}, Image Loads: ${imageLoads}`);
            
          } catch (error) {
            results.push({
              category: venue.category,
              placeId: similarName,
              placeName: venue.name,
              fileName,
              testUrl,
              fetchStatus: 'error',
              imageLoads: false,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            console.log(`❌ Fuzzy test: ${venue.category}/${venue.name} → ${similarName} - Error: ${error}`);
          }
        }
      }
    }
    
    setTestResults(results);
    setIsTestingImages(false);
    
    // Log summary
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    console.log(`📊 Fuzzy Matching Test Summary: ${successCount}/${totalCount} images loaded successfully`);
  };

  // Get sample mappings for debugging
  const getSampleMappings = () => {
    if (!venueMappings) return null;
    
    const samplePlaceId = Object.keys(venueMappings.placeIdMappings || {})[0];
    const samplePlaceName = Object.keys(venueMappings.placeNameMappings || {})[0];
    
    return {
      samplePlaceId,
      samplePlaceName,
      placeIdMappingsCount: Object.keys(venueMappings.placeIdMappings || {}).length,
      placeNameMappingsCount: Object.keys(venueMappings.placeNameMappings || {}).length,
      categories: Object.keys(venueMappings.categoryMappings || {}),
      s3Config: venueMappings.s3Config
    };
  };

  const sampleMappings = getSampleMappings();

  // Group test results by category
  const resultsByCategory = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Image System Debugger
          <Badge variant="outline">Debug Tool</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="font-semibold mb-2">S3 Connectivity Test</h4>
            <Button 
              onClick={testConnectivity} 
              disabled={isTesting}
              variant="outline"
            >
              {isTesting ? 'Testing...' : 'Test S3 Connection'}
            </Button>
            
            {s3Status && (
              <div className="mt-2">
                <Badge 
                  variant={s3Status.connected ? "default" : "destructive"}
                  className="mb-2"
                >
                  {s3Status.connected ? '✅ Connected' : '❌ Failed'}
                </Badge>
                {s3Status.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {s3Status.error}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">CORS Test</h4>
            <Button 
              onClick={testCors} 
              disabled={isTestingCors}
              variant="outline"
            >
              {isTestingCors ? 'Testing...' : 'Test CORS Access'}
            </Button>
            
            {corsStatus && (
              <div className="mt-2">
                <Badge 
                  variant={corsStatus.corsWorking ? "default" : "destructive"}
                  className="mb-2"
                >
                  {corsStatus.corsWorking ? '✅ CORS Working' : '❌ CORS Failed'}
                </Badge>
                {corsStatus.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {corsStatus.error}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Random Image Test</h4>
            <Button 
              onClick={testRandomImages} 
              disabled={isTestingImages}
              variant="outline"
            >
              {isTestingImages ? 'Testing...' : 'Test Random Images'}
            </Button>
            
            {testResults.length > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="mb-2">
                  {testResults.filter(r => r.success).length}/{testResults.length} Success
                </Badge>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Fuzzy Matching Test</h4>
            <Button 
              onClick={testFuzzyMatching} 
              disabled={isTestingImages}
              variant="outline"
            >
              {isTestingImages ? 'Testing...' : 'Test Fuzzy Matching'}
            </Button>
            
            <p className="text-xs text-gray-600 mt-1">
              Tests venues without place IDs
            </p>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Test Results by Category</h4>
            <div className="space-y-4">
              {Object.entries(resultsByCategory).map(([category, results]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2 capitalize">{category}</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {results.map((result, index) => (
                      <div key={index} className="text-sm p-2 rounded border-l-4" 
                           style={{ borderLeftColor: result.success ? '#10b981' : '#ef4444' }}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{result.placeName || result.placeId}</p>
                            <p className="text-xs text-gray-600">{result.fileName}</p>
                            <p className="text-xs text-gray-500 break-all">{result.testUrl}</p>
                          </div>
                          <div className="ml-2 text-right">
                            <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                              {result.success ? '✅' : '❌'}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Fetch: {result.fetchStatus}
                            </p>
                          </div>
                        </div>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1">Error: {result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Venue Mappings Status</h4>
          {sampleMappings ? (
            <div className="text-sm space-y-2 bg-gray-50 p-3 rounded">
              <p><strong>Total Place ID Mappings:</strong> {sampleMappings.placeIdMappingsCount}</p>
              <p><strong>Total Place Name Mappings:</strong> {sampleMappings.placeNameMappingsCount}</p>
              <p><strong>Available Categories:</strong> {sampleMappings.categories.join(', ')}</p>
              <p><strong>S3 Base URL:</strong> {sampleMappings.s3Config?.baseUrl}</p>
              <p><strong>Main Folder:</strong> {sampleMappings.s3Config?.mainFolder}</p>
              
              {sampleMappings.samplePlaceId && (
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p><strong>Sample Place ID Mapping:</strong></p>
                  <p className="font-mono text-xs">
                    {sampleMappings.samplePlaceId} → {venueMappings.placeIdMappings[sampleMappings.samplePlaceId]}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Would try: {sampleMappings.s3Config?.baseUrl}/{sampleMappings.s3Config?.mainFolder}/{venueMappings.placeIdMappings[sampleMappings.samplePlaceId]}/{venueMappings.placeIdMappings[sampleMappings.samplePlaceId]}_1.jpg
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600">❌ Venue mappings not loaded</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Current Configuration</h4>
          <div className="text-sm space-y-1">
            <p><strong>S3 Base URL:</strong> https://klispots-venue-images.s3.eu-north-1.amazonaws.com</p>
            <p><strong>Fallback Strategy:</strong> Minimal fallback (focus on S3)</p>
            <p><strong>Image Timeout:</strong> 2000ms (optimized for S3)</p>
            <p><strong>Cache System:</strong> In-memory mapping cache</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Known Issues & Solutions</h4>
          <div className="text-sm space-y-2">
            <div className="p-2 bg-yellow-50 rounded">
              <p><strong>Issue:</strong> S3 bucket CORS configuration</p>
              <p><strong>Solution:</strong> Check S3 bucket CORS settings for cross-origin access</p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <p><strong>Issue:</strong> Image path construction</p>
              <p><strong>Solution:</strong> Verify S3 folder structure matches venue mappings</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <p><strong>Fixed:</strong> Simplified image loading strategy</p>
              <p><strong>Fixed:</strong> Removed complex fallback logic</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Next Steps</h4>
          <ol className="text-sm list-decimal list-inside space-y-1">
            <li>Test S3 connectivity using the button above</li>
            <li>Check browser console for detailed image loading logs</li>
            <li>Verify S3 bucket CORS settings allow cross-origin access</li>
            <li>Test with a known working venue ID from the mappings</li>
            <li>Check network tab for failed S3 requests</li>
          </ol>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Test</h4>
          <p className="text-sm text-gray-600 mb-2">
            Try accessing this sample URL directly in your browser to test S3 access:
          </p>
          {sampleMappings?.samplePlaceId && (
            <div className="p-2 bg-gray-100 rounded font-mono text-xs break-all">
              {sampleMappings.s3Config?.baseUrl}/{sampleMappings.s3Config?.mainFolder}/{venueMappings.placeIdMappings[sampleMappings.samplePlaceId]}/{venueMappings.placeIdMappings[sampleMappings.samplePlaceId]}_1.jpg
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
