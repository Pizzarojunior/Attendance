# Attendance Tracking System

A web-based attendance management system designed for educational institutions to track and manage attendance records for students across different levels (classes) and streams.

## Features

✅ **Admin Authentication** - Secure login system for authorized access  
✅ **Add/Manage Members** - Add, edit, and delete students with their level and stream information  
✅ **Mark Attendance** - Easily mark attendance by selecting level+stream and person  
✅ **Attendance Records** - View detailed attendance records with multiple filter options  
✅ **Print Reports** - Generate and print filtered attendance reports  
✅ **Data Persistence** - All data is saved locally using browser storage  
✅ **Level & Stream Display** - View classes with both level and stream (e.g., "Form 1 A")  

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required
- Works offline with local data storage

## Getting Started

### Login

1. Open `index.html` in your web browser
2. You will be redirected to the login page
3. Enter credentials:
   - **Username:** Admin
   - **Password:** admin

### Add a Person

1. Navigate to the "Add Person" section
2. Fill in the following details:
   - **Name:** Full name of the student
   - **Role:** Student, Employee, or custom role
   - **Level:** Select the class (Nursery 1, Class 1, Form 1, etc.)
   - **Stream:** Select the stream (A-Z)
3. Click "Add Person" button
4. The person will be added to the system and saved

### Manage Members

1. Click "Show Manage Members" button in the Add Person section
2. Select a level+stream combination from the dropdown (e.g., "Form 1 A")
3. View all members in that class
4. Options available:
   - **Edit:** Modify member details
   - **Delete:** Remove member and all their attendance records

### Mark Attendance

1. Navigate to the "Mark Attendance" section
2. Select a **Level** (displays as "Level Stream" e.g., "Form 1 A")
3. Stream will auto-populate automatically
4. Select a **Person** from the list
5. Choose the **Date** (defaults to today)
6. Select **Status:** Present or Absent
7. Click "Mark Attendance" button

### View Attendance Records

1. Scroll to the "Attendance Records" section
2. Use filters to narrow down records:
   - **Filter by Date:** Select a specific date
   - **Filter by Level:** Select a class level
   - **Filter by Stream:** Select a specific stream
   - **Filter by Status:** Filter by Present or Absent
3. View statistics at the top:
   - Total Records
   - Total Present
   - Total Absent
   - Total in Selected Class

### Delete Attendance Records

1. In the Attendance Records table, click the "Delete" button next to any record
2. Confirm the deletion
3. The record will be removed

### Print Reports

1. Apply filters to show only the records you want to print
2. Click the "Print Records" button
3. A print preview will open showing:
   - Report title
   - Filter information (Level & Stream)
   - Attendance table with filtered records
   - Action buttons will be hidden in print view
4. Print or save as PDF using your browser's print dialog

## Data Structure

### Person Object
```javascript
{
  id: timestamp,
  name: "Student Name",
  role: "Student",
  level: "Form 1",
  stream: "A",
  dateAdded: "DD/MM/YYYY"
}
```

### Attendance Record Object
```javascript
{
  id: timestamp,
  personId: person_id,
  date: "YYYY-MM-DD",
  status: "present" | "absent",
  timestamp: "Date and Time String"
}
```

## Browser Storage

- **localStorage** is used to store all data
- Data persists across browser sessions
- Clear browser cache/storage to reset all data

## Levels Available

**Primary Classes:**
- Nursery 1, Nursery 2
- Kindergarten 1, Kindergarten 2
- Class 1, Class 2, Class 3, Class 4, Class 5, Class 6

**Secondary Classes:**
- Form 1, Form 2, Form 3

**Streams:** A through Z

## Tips

💡 **Auto-Stream Population:** When you select a level in "Mark Attendance", the stream field automatically populates  
💡 **Manage by Level+Stream:** When managing members, you can filter by the complete level+stream combination  
💡 **Page Refresh:** After successful login, the page refreshes to load all data fresh  
💡 **Data Safety:** Always export/backup important data before clearing browser storage  

## Troubleshooting

**Cannot login?**
- Check username: "Admin" (capital A)
- Check password: "admin" (lowercase)
- Ensure cookies/session storage is enabled

**Members not showing?**
- Select a level+stream combination from the dropdown
- Make sure members have been added to that level and stream

**Data disappeared?**
- Check if browser cache was cleared
- Data is stored in localStorage - clearing it will delete all records

## File Structure

```
├── index.html       # Main attendance system interface
├── login.html       # Admin login page
├── script.js        # Core functionality and logic
├── style.css        # Styling and layout
└── README.md        # This file
```

## Version

**Version 1.0**  
Last Updated: 2026-07-21

## Support

For issues or feature requests, please contact the development team or submit feedback.

---

**Note:** This system uses browser local storage. For production use with multiple users/devices, consider implementing a backend database solution.
