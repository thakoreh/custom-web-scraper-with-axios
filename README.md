Introduction

This TypeScript script is designed to monitor a products (currently specific product) on the Telfar website. It checks if the product is in stock, adds it to the cart, and proceeds to the checkout process. It also handles cookies and headers to mimic a real user and not a bot.
It also gives us shipping options and its cost for US resident.

Prerequisites

- Node.js installed on your machine.
- Basic knowledge of TypeScript and Node.js.
- An IDE or code editor for TypeScript development (e.g., Visual Studio Code).

Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run npm install to install the necessary packages. This script uses axios, form-data, cheerio, axios-cookiejar-support, and tough-cookie.

Usage

1. Open the main.tsx file in your IDE.
2. Run the script using the command ts-node main.js in your terminal.


What the Code Does

The script performs the following steps:

1. Fetches the product data from the Telfar website.
2. Checks if the product is in stock.
3. If the product is in stock, it adds the product to the cart.
4. It then creates a cookie jar and a client with cookie support.
5. The script then adds the product to the cart and extracts various cookies and headers.
6. It then proceeds to the checkout process, fetching the checkout page and extracting the authenticity token.
7. The script then defines the shipping address and submits the shipping information.
8. Finally, it extracts and logs all available shipping options and their rates.

Running the Code

To run the code, use the command ts-node main.js in your terminal. Make sure you are in the correct directory where the main.tsx file is located.

Contributing

Contributions are welcome. Please fork the repository and create a pull request with your changes.

Instructions for Developer if contributing

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine using the command `git clone https://github.com/your-username/custom-web-scraper-with-axios.git`. (replace your-username with your actual GitHub username)
3. Navigate to the project directory using the command `cd custom-web-scraper-with-axios`.
4. Install the necessary packages by running `npm install`.
5. Open the project in your IDE or code editor.
6. Create a new branch for your changes using the command `git checkout -b branch-name`. (replace branch-name with your actual branch name)
7. Make your changes in this new branch.
8. Make modifications to the `main.tsx` file as needed. 
9. Compile the TypeScript file by running the command `tsc main.tsx` in your terminal. This will generate a new `main.js` file or update the existing one.
10. To execute the JavaScript file, use the command `node main.js` in your terminal.
11. Test your changes thoroughly.
12. Commit your changes using the command `git commit -m "Your commit message"`.
13. Push your changes to your forked repository using the command `git push origin branch-name`.
14. Go to the GitHub page of your forked repository and create a new pull request.
15. Wait for your changes to be reviewed. If there are any issues, address them and push your updates.
16. Once your changes are approved, they will be merged into the main repository.

Disclaimer

Please note that this script is for educational purposes only. Always respect the website's robots.txt file and use this responsibly.