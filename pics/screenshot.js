const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();

  console.log("Navigating to Home Page...");
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, '01_home_page.png'), fullPage: true });

  console.log("Filling dummy data...");
  await page.type('#companyName', 'Cyberdyne Systems');
  await page.type('#founderName', 'Miles Dyson');
  await page.type('#description', 'Neural-net based artificial intelligence.');
  
  // Set some ML parameters
  await page.evaluate(() => {
    document.querySelector('#aiInvestment').value = '5000000';
    document.querySelector('#aiMaturityScore').value = '85';
    document.querySelector('#automationRate').value = '60';
  });
  
  await page.screenshot({ path: path.join(__dirname, '02_home_filled.png'), fullPage: true });

  console.log("Submitting form and transitioning to Engine...");
  await page.click('button[type="submit"]');
  
  // Wait for the API call to resolve and the AI Report Modal to appear
  await new Promise(r => setTimeout(r, 4000)); 
  
  console.log("Taking AI Report Modal screenshot...");
  await page.screenshot({ path: path.join(__dirname, '03_q1_ai_report_modal.png'), fullPage: true });

  console.log("Closing Modal...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.includes('ACKNOWLEDGE'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log("Taking Engine Dashboard screenshot...");
  await page.screenshot({ path: path.join(__dirname, '04_engine_dashboard.png'), fullPage: true });

  console.log("Making a decision...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.includes('DEVELOP') || b.innerText.includes('PRODUCT') || b.innerText.includes('CAMPAIGN'));
    if (target) target.click();
  });
  
  // Wait for API again
  await new Promise(r => setTimeout(r, 4000));

  console.log("Taking Q2 Decision Report Modal screenshot...");
  await page.screenshot({ path: path.join(__dirname, '05_q2_decision_report.png'), fullPage: true });

  await browser.close();
  console.log("All screenshots saved successfully!");
})();
