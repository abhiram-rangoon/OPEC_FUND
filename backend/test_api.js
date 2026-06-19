async function runDiagnostics() {
  const url = 'http://localhost:3000/api/auth/login';
  console.log(`Sending diagnostic login request to ${url}...`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '7702858070',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log(`Login Status: ${res.status}. Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Login Diagnostic Failed!");
    console.error("Error Message:", error.message);
  }

  const registerUrl = 'http://localhost:3000/api/auth/register';
  console.log(`\nSending diagnostic registration request to ${registerUrl}...`);
  try {
    const uniquePhone = '99' + Math.floor(10000000 + Math.random() * 90000000);
    const res = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Diagnostic User',
        phone: uniquePhone,
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log(`Registration Status: ${res.status}. Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Registration Diagnostic Failed!");
    console.error("Error Message:", error.message);
  }
}

runDiagnostics();
