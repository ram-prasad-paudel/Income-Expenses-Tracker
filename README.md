#  Income & Expenses Tracker

A simple and powerful tool to track your money, debts, and savings in one place.

**🔗 [Click Here to Open the Live App](https://ram-prasad-paudel.github.io/Income-Expenses-Tracker/)**

## 📸 Interface Preview

### 🖥️ Desktop Dashboard View
This screenshot shows the application running on a full-size computer screen. 
* **Layout:** Uses a wide-screen dashboard layout.
* **Functionality:** You can see the main balance card, the input forms for adding transactions, and the scrollable history list all in one clear view.
![Desktop Dashboard](desktop-view.png)

---

### 📱 Mobile Responsive View
This screenshot shows the application running on a mobile phone screen.
* **Responsiveness:** When opened on a smartphone, the interface automatically stacks the elements vertically to fit a narrow screen.
* **Touch-Friendly:** Buttons and form fields remain easy to tap and navigate, ensuring a smooth user experience on the go.
![Mobile View](mobile-view.png)
#  What is this project?
Most expense trackers only show what you spend. This app is different because it also helps you track **money you have lent to or borrowed from others**. 

I built this using modern web technologies to ensure it works perfectly on both your computer and your mobile phone.



## ✨ Main Features 
* **Dynamic DOM Manipulation:** The UI updates instantly using JavaScript whenever you add or delete a transaction.
* **JavaScript Event Handling:** Uses event listeners to capture user inputs from buttons and forms.
* **Smart Form Validation:** Ensures all required fields (Amount, Category, Date) are filled correctly before saving.
* **Data Persistence (Web Storage API):** Utilizes `localStorage` and JSON serialization to save your financial data permanently.
* **Category Filtering:** Uses array methods to filter and display specific transaction types (Wage, Food, Bills, etc.).
* **Responsive CSS Grid & Flexbox:** A mobile-first layout designed with Media Queries for all screen sizes.

---

##  How to Run it Locally
1. Download the code as a ZIP file.
2. Unzip the folder on your computer.
3. Simply double-click the `index.html` file to open it in your browser.



## Reflection
Building this Income and Expense Tracker was a rewarding experience that solidified my understanding of modern JavaScript. My goal was to create a functional dashboard that solves a real-world problem by tracking not only standard expenses but also personal debts. 

One of the biggest technical challenges I faced was managing the application's state and ensuring data persistence. I learned how to use the `localStorage` API to save data as JSON strings, ensuring the user's financial records are safe even after a page refresh. I also focused heavily on responsive design; initially, the layout broke on smaller screens, but by implementing CSS Media Queries and Flexbox, I ensured the app is fully accessible on mobile devices. I also applied concepts from the DOM Scripting workshops to update the UI dynamically. In the future, I plan to add data visualization like pie charts to improve the user experience further.

---
## Author
**Ram Prasad Paudel**
