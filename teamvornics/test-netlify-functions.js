// Simple test script to verify Netlify Functions setup
const axios = require('axios');

async function testNetlifyFunctions() {
  try {
    console.log('Testing Netlify Functions...');
    
    // Test health endpoint
    console.log('\nTesting /api/health endpoint:');
    const healthResponse = await axios.get('http://localhost:8888/api/health');
    console.log('Health Response:', healthResponse.data);
    
    // Test status endpoint
    console.log('\nTesting /api/status/:job_id endpoint:');
    const statusResponse = await axios.get('http://localhost:8888/api/status/test-job-id');
    console.log('Status Response:', statusResponse.data);
    
    // Test download endpoint
    console.log('\nTesting /api/download/:job_id endpoint:');
    const downloadResponse = await axios.get('http://localhost:8888/api/download/test-job-id');
    console.log('Download Response:', downloadResponse.data);
    
    console.log('\nAll tests passed! Netlify Functions are working correctly.');
  } catch (error) {
    console.error('Error testing Netlify Functions:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testNetlifyFunctions();