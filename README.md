📱 Project OneCall – Description


OneCall is a real-time healthcare emergency platform designed to connect patients in urgent situations with nearby hospitals, ambulances, and healthcare providers. It leverages location tracking, instant alerts, and dynamic routing to ensure that medical help reaches patients as quickly as possible.

🔑 Core Features
Patient Emergency Alerts: Users can trigger an SOS that immediately notifies nearby hospitals and ambulance services.

Real-Time Location Tracking: GPS integration ensures accurate patient location for faster response.

Dynamic Ambulance Routing: Intelligent routing algorithms minimize travel time by considering traffic and distance.

Healthcare Service Integration: Hospitals and clinics can register to receive alerts and manage incoming emergency requests.

Secure Communication: End-to-end encrypted channels for patient–provider communication.

🎯 Purpose
The purpose of OneCall is to simplify emergency healthcare workflows, reduce response times, and save lives by bridging the gap between patients and providers through technology.

🖥️ Admin Console – Description
The Admin Console is the backend management system for OneCall. It provides healthcare administrators, hospital staff, and system operators with tools to monitor, manage, and optimize emergency responses.

🔑 Core Features
Dashboard Overview: Real-time visualization of active emergencies, ambulance locations, and hospital capacity.

User & Hospital Management: Admins can onboard hospitals, verify ambulance services, and manage patient records securely.

Analytics & Reports: Insights into response times, service efficiency, and patient outcomes.

Role-Based Access Control (RBAC): Ensures secure access for different stakeholders (admins, hospital staff, ambulance drivers).

System Monitoring: Tracks uptime, alerts, and logs for reliability.

🎯 Purpose
The Admin Console ensures operational transparency and efficiency, enabling healthcare providers to coordinate seamlessly and improve emergency response outcomes.

⚙️ Tech Stack
Layer	Technologies
Frontend (Mobile App)	Android (Java/Kotlin), XML UI, Retrofit for API calls
Frontend (Admin Console)	React.js / Angular (for web dashboard), Material UI
Backend	Node.js / Django (REST APIs), Python for automation
Database	PostgreSQL / MySQL (structured patient & hospital data), Redis (caching for real-time alerts)
Real-Time Communication	WebSockets, Firebase Cloud Messaging (push notifications)
Location Services	Google Maps API, GPS integration
Deployment & DevOps	Docker, Kubernetes, AWS/GCP for cloud hosting
Security	JWT Authentication, HTTPS, Role-Based Access Control

## 🚀 How to Run

### AdminConsole
The AdminConsole is a Node.js/Typescript application.

1. **Navigate to the directory:**
   ```bash
   cd AdminConsole
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### OneCall App
The OneCall App is a native Android application (Kotlin/Java).

### OneCall Apk Drive Link
For easy accessibility, the OneCall App is available as an APK file on Google Drive.
Drive Link: https://drive.google.com/file/d/1JSQTzTFQFmZQB1O4v3XIx9o3aNPSxIwE/view?usp=drive_link

#### Prerequisites
- Android Studio to run and debug the app.
- Java Development Kit (JDK) installed.

#### Steps
1. **Open project in Android Studio:**
   - Launch Android Studio.
   - Select **Open** and browse to `OneCall_App/OneCall`.

2. **Sync & Build:**
   - Allow Gradle to sync dependencies.
   - Connect a device or start an emulator.

3. **Run:**
   - Click the **Run** button (green play icon) in Android Studio.

