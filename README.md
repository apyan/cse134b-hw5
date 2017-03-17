# AmiiboDex Web Application
Visit: https://amiibodex2.firebaseapp.com/

![Homepage](/doc_images/Web_Homepage.png)

## About AmiiboDex
AmiiboDex is a web application where users can keep track on their amiibo collection. Initially being provided with the original Super Smash Bros. line, users can customize their amiibo list by adding and deleting new amiibos. Accounts must be made in order to have a saved list.

## Application Development Specifications
* Frontend: HTML, CSS, JavaScript, jQuery, AngularJS
* Backend: JSON, Firebase Services
* Monitoring: Google Chrome, Lighthouse
* Compatiblity: Windows, Linux, Mac OS X, Android

#### Frontend Development
* HTML was used for the earlier development stage, primarily upon the development of the basic elements of the webpage. This includes the buttons, text fields, and other various interactive elements needed for the web application.
* CSS provides the fundamental design elements for the webpage. Such as, the CSS code provides the aesthetics of the buttons, as well as the design manner of the display table.
* JavaScript, along with jQuery and AngularJS, are what makes the web application function. JavaScript allows the amiibo table to act by displaying and sorting the amiibos in a certain order. Furthermore, JavaScript provides interaction with the backend services to store users' data. The language of jQuery, a JavaScript element, provides many interactive elements in the application. For example, the progress bar and spinner were developed using jQuery, thus engaging users to the application.

#### Backend Development
* JSON is a JavaScript element that aids the user data storage of the web application. Furthermore, JSON also helps provide the AmiiboDex original list data, allowing the users to have the original Super Smash Bros. line.
* The Firebase services, provided by Google, provides free hosting services to make the AmiiboDex web application run. These services includes the webpage hosting and user database storage. Furthermore, it provides features for the users to login with their email or Gogole accounts, and sign-out. Also, the Firebase database runs on JSON files for the web application.

#### Monitoring
* Google Chrome provides developer tools to debug the web application. Thus, this was utilized upon debugging JavaScript files to detect and errors. Furthermore, if provides helpful features, such as managing network connections and disabling cookies.
* Lighthouse is a Google Chrome plug-in that analyzes and displays the processing and working speed of the web application. This allows for optimization of the AmiiboDex to be evaluated base on the performance in various scenarios. For example, this provides guidelines on how the reactive the web application should be during offline sessions.

#### Compatibility
* The AmiiboDex is compatible with Windows, Linux, Mac OS X, and Android operating systems. The main compatibility element of the application is the Internet browser it runs on. This includes Google Chrome, Safari, and Internet Explorer.

## Mobile Web Application
The AmiiboDex web application was designed futher to be implemented into smartphones as a standalone mobile application. Utilizing JavaScript and JSON language, the web application can be recognized as a mobile application, rather than solely relying on Internet browser applications, such as Chrome and Safari.

##### Android
Given by the image below, after when the AmiiboDex application has been accessed a few times, the Chrome browser would prompt the user to install the AmiiboDex application as a standalone mobile application. This was made possible with a creation of the manifest file, written in JSON, as well as utilizing a JavaScript library provided by Google.

![Android](/doc_images/Android_Web_App.png)
