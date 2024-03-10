# Registering a Firebase Application


Firestore is a NoSQL cloud database provided by Firebase that allows you to store and sync data for your applications. Follow these steps to register Firestore for your Firebase project.

## Step 1: Navigate to Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select the Firebase project you've previously created or create a new one.

## Step 2: Access Firestore

1. In the Firebase project dashboard, locate the "Firestore" section.
2. Click on the "Firestore" menu item to access the Firestore database.

## Step 3: Set Up Firestore

1. Click on the "Create Database" button to start the Firestore setup.
2. Choose a mode for your database: "Production" or "Test."
3. Select a location for your database.
4. Click "Next" and set up security rules for your database (you can modify them later).
5. Click "Enable" to finish setting up Firestore for your Firebase project.

## Step 4: Obtain Firestore Configurations

1. After setting up Firestore, you'll see the Firestore dashboard.
2. In the Firestore dashboard, click on the "Settings" (gear) icon.
3. Navigate to the "Project settings" tab.
4. Scroll down to the "Your apps" section and find the web app you registered earlier.
5. Click on the "</>" icon to reveal the Firestore configurations (apiKey, authDomain, projectId, etc.).
6. Copy these configurations as you'll need them to connect your application to Firestore.

## Step 5: Integrate Firestore in Your App

Integrate Firestore into your application using the Firebase SDK and the configurations obtained in the previous step. Visit the [Firebase documentation](https://firebase.google.com/docs/firestore) for language-specific guides and examples.

# Renaming and Using .env for Environment Variables

When managing environment variables in your project, it's common to use a `.env` file. This file typically holds sensitive information and configurations.

## Step 1: Delete .env.example

If you have an existing `.env.example` file, you can safely delete it as it is often used as a template.

```bash
# Delete .env.example
rm .env.example
```

## Step 2: Rename .env.example to .env
If you don't have a .env file, or if you want to replace the existing .env file, you can simply rename your .env.example file.

# Rename .env.example to .env
mv .env.example .env

## Step 3: Update .env with Descriptive Information
Open your newly renamed .env file in a text editor and update it with descriptive information and environment variable definitions. For example:

```bash
# Firebase Configurations
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
EXPO_PUBLIC_MEASUREMENT_ID==your_measurement_id
```

The variable EXPO_PUBLIC_MILLISECONDS represents the time interval for refreshing the location.

Replace your_api_key, your_auth_domain, and other values with the actual values from your firebaseConfig.


# Run React Native Expo and Build with EAS

## Install Expo CLI AND EAS CLI

```bash
npm install -g expo-cli
```

# Clone React Native Expo Project

```bash
git clone https://github.com/Boss0049/tracking-devices
cd tracking-devices
```

# Install Dependencies

```bash
npm install
```

# Run Project in Expo

```bash
expo start
```

This will open the Metro Bundler window in your browser. You can choose to run it on an Android/iOS simulator or a device connected to Expo Go.

# Using EAS for Build Expo Projects

## Introduction

[EAS](https://docs.expo.dev/eas/) (Expo Application Services) is a set of services provided by Expo to streamline the development and deployment of Expo projects. This guide will walk you through the basic steps to use EAS in your Expo project.

## Prerequisites

Before getting started, make sure you have the following:

- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An Expo project initialized and configured

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Authenticate with EAS

```bash
eas login
```

Follow the prompts to log in to your Expo account and authenticate with EAS.

## Step 3: Configure EAS Build

```bash
eas init
```

## Step 4: Build and Submit

To build your project with EAS, run:

| Platform | Environments | command                                     |
| :--------| :-----------:| :-------------------------------------:     |
| ios      |  development | eas build -p ios --profile development      |
| ios      |   preview    | eas build -p ios --profile preview          |
| ios      |  production  | eas build -p ios --profile production       |
| android  |  development | eas build -p android --profile development  |
| android  |   preview    | eas build -p android --profile preview      |
| android  |  production  | eas build -p android --profile production   |

Follow the prompts to choose the build configuration and target platform.

## Step 5: Monitor Build Status
Check the status of your build using:

```bash
eas build:list
```
or this link https://expo.dev/

Monitor the build status in the EAS web interface or command line.

# Services Used in This Project

## 1. Firebase Firestore

[Firebase Firestore](https://firebase.google.com/docs/firestore) is a cloud-based NoSQL database provided by Firebase. It is utilized in this project to store and manage data in a scalable and real-time manner.


