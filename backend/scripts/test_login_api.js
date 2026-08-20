async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'hr@orbitworks.com',
        password: 'password123'
      })
    });
    
    console.log("LOGIN RESPONSE STATUS:", res.status);
    const data = await res.json();
    console.log("LOGIN RESPONSE DATA:", data);
  } catch (err) {
    console.error("Connection error:", err.message);
  }
}

test();
