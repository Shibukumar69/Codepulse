// Load and display attendance data from JSON file

fetch('attendance.json')
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#attendanceTable tbody');
        data.forEach(record => {
          const row = `<tr>
            <td>${record.subject}</td>
            <td>${record.totalClasses}</td>
            <td>${record.attended}</td>
            <td>${record.percentage}</td>
          </tr>`;
          tbody.innerHTML += row;
        });
      });

// attend.js - Script to automate attendance data extraction from AIMS

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // set to false to see browser
  const page = await browser.newPage();

  // 1. Go to AIMS login page
  await page.goto('https://aims.aktu.ac.in/aims');

  // 2. Login
  await page.type('#username', 'YOUR_USERNAME');
  await page.type('#password', 'YOUR_PASSWORD');
  await page.click('#loginButton'); // Adjust selector as per actual button
  await page.waitForNavigation();

  // 3. Navigate to attendance page
  await page.goto('https://aims.aktu.ac.in/aims/Student/Attendance.aspx');

  // 4. Extract attendance data
  const attendanceData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table#attendanceTable tr')); // Adjust selector
    return rows.slice(1).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        subject: cells[0].innerText.trim(),
        totalClasses: cells[1].innerText.trim(),
        attended: cells[2].innerText.trim(),
        percentage: cells[3].innerText.trim()
      };
    });
  });

  // 5. Save to JSON
  fs.writeFileSync('attendance.json', JSON.stringify(attendanceData, null, 2));
  console.log('Attendance data saved.');

  await browser.close();
})();