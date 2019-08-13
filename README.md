# ReactNative-GCP-Projects

### One Time Password Template

User provides phone number as an identifying token. Text user a code, user enters code into the app to prove ownership of the phone

#### Tech Stack

React Native: Show user a form to sign up and sign in via one time password
Twilio: Send text messages to user
Firebase: Store user data, including user accounts and correct one time password codes
Google Cloud Functions: Tiny bits of code that run one time on demand. Has access to data in firebase
