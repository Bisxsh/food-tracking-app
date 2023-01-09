# food-tracking-app
 Our system is developed using React Native to maximise the range of supporting target users.
 This includes the very core functionalities which make up our aim for the application: 
- Tracking food expiry dates.
- Viewing information on food (nutrients, allergy information etc.)
- Reminders for food expiration dates.
- Recipe suggestions.
- Categorizing food stored in the user’s inventory.
 Through this we hope to minimise the amount of food that is needlessly thrown away by users, which 
among a large enough user base will help to reduce food waste.

 There are seven major systems  (Interface, Food Logging, Notification, Profile, Filtering, Food, Meal) with four having sub systems. The one-way or  two-way arrows show the flow of information or commands from one system or subsystem to another. For example,  if a user wanted to input a new food product into the product, the process would be as follows: Interface gives a  6 command to Food Logging which then either uses manual input or calls the external Receipt Scanner or Barcode  Scanner API. Food Logging then transfers the information to the Food Database (Food DB), thus ending the process. 
