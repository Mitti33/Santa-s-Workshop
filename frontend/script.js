
document.getElementById('letterForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // stop page reload

  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch('http://localhost:3000/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    alert("Letter sent!" || json.error); // show confirmation

     if (json && json.ok) {
      // Hide the form and the page title (h1)
      const form = document.getElementById('letterForm');
      const h1 = document.querySelector('h1');
      if (form){
        form.style.display = 'none';
        if (h1) h1.style.display = 'none';
      }

      // send email (fire-and-forget; handle errors if you want)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name, wish: data.wish })
      }).catch(console.error);

      // Show confirmation box if present
      const confirmBox = document.getElementById('confirmation');
      if (confirmBox) {
        confirmBox.style.display = 'block';
        const ct = document.getElementById('confirmText');
        if (ct) ct.textContent = `Thanks ${data.name}! Santa will unwrap your wish for "${data.wish}" on Christmas morning 🎄✨\nPlease check your gift in your email upon delivery!`;
      }
    }
  } catch (err) {
    console.error('Error sending letter:', err);
    alert('Something went wrong sending your letter.');
  }
});

