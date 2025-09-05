// Simple test script to check authentication

async function testAuth() {
    try {
        console.log('Testing login...');
        
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'rakinshahriar@iut-dhaka.edu',
                password: '123456'
            })
        });
        
        if (!loginResponse.ok) {
            const error = await loginResponse.text();
            console.log('Login failed:', error);
            return;
        }
        
        const loginData = await loginResponse.json();
        console.log('Login successful! Token:', loginData.token);
        
        // Test URL creation with the fresh token
        console.log('\nTesting URL creation...');
        const urlResponse = await fetch('http://localhost:5000/api/urls/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                originalUrl: 'https://www.youtube.com/watch?v=test'
            })
        });
        
        if (!urlResponse.ok) {
            const error = await urlResponse.text();
            console.log('URL creation failed:', error);
            return;
        }
        
        const urlData = await urlResponse.json();
        console.log('URL creation successful!', urlData);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAuth();
