# Student Import Guide

## Overview
The Students Management page now supports bulk importing students from Excel (.xlsx, .xls) or CSV files. When you import students, the system automatically:
1. Creates Firebase Authentication accounts for each student
2. Stores student data in Firestore database
3. Generates account credentials (Email and Password)

## Supported File Formats

### CSV Format
```csv
LRN,Name,Grade,Section,Sex,BirthDate,Address,Barangay,Municipality,Province,ContactNumber,LearningModality
1234567890,Juan Santos,Grade 7,A,Male,2008-05-15,123 Main Street,Tagumpay,Talakag,Bukidnon,09123456789,Face-to-Face
1234567891,Maria Cruz,Grade 7,B,Female,2008-08-20,456 Oak Avenue,Sumasama,Talakag,Bukidnon,09234567890,Online
```

### Excel Format (.xlsx or .xls)
| LRN | Name | Grade | Section | Sex | BirthDate | Address | Barangay | Municipality | Province | ContactNumber | LearningModality |
|-----|------|-------|---------|-----|-----------|---------|----------|--------------|----------|----------------|------------------|
| 1234567890 | Juan Santos | Grade 7 | A | Male | 2008-05-15 | 123 Main Street | Tagumpay | Talakag | Bukidnon | 09123456789 | Face-to-Face |
| 1234567891 | Maria Cruz | Grade 7 | B | Female | 2008-08-20 | 456 Oak Avenue | Sumasama | Talakag | Bukidnon | 09234567890 | Online |

## Required Fields
- **LRN** - Learning Reference Number (unique identifier)
- **Name** - Student's full name

## Optional Fields
- Grade (e.g. Grade 7, Grade 10)
- Section (e.g. A, B, C)
- Email
- Sex (Male/Female)
- BirthDate (YYYY-MM-DD format)
- Address
- Barangay
- Municipality
- Province
- ContactNumber
- LearningModality (Face-to-Face, Online, Hybrid)

## How to Import

### Step 1: Prepare Your File
1. Create an Excel (.xlsx or .csv file) with student data
2. Include headers in the first row
3. Use the field names as shown above (not case-sensitive)

### Step 2: Import Students
1. Go to **Students Management** page
2. Click the **"Import Excel"** button
3. Select your CSV or Excel file
4. The system will automatically process the file

### Step 3: Monitor Import
- **Success Message**: Shows how many students were imported and how many were skipped
- **Skipped Students**: Usually accounts that already exist in the system
- The student table will automatically refresh with new students

## Generated Credentials

When each student is imported, an automatic account is created with:
- **Email**: `{LRN}@lms.talakag`
- **Password**: `{LRN}@123`

Example:
- LRN: `1234567890`
- Email: `1234567890@lms.talakag`
- Password: `1234567890@123`

## Important Notes

⚠️ **Duplicate LRNs**: If a student with the same LRN already exists:
- The system will skip that record
- Check the import summary to see skipped count
- You can manually edit existing students using the Edit button

⚠️ **Data Validation**:
- LRN and Name are required
- If LRN or Name is missing, that row will be skipped
- Email addresses should be unique

⚠️ **File Size**: Recommended file size is under 5MB for best performance

## Troubleshooting

### Import shows 0 imported, all skipped
- Check if all students already exist in the system
- Verify LRN values are unique
- Ensure Name column has values

### File doesn't upload
- Only CSV, .xlsx, and .xls files are supported
- Check file isn't corrupted
- Try saving Excel file as CSV format

### Password too short error (old issue - now fixed)
- Password format is `{LRN}@123` (always 6+ characters)
- This ensures Firebase requirements are met

## Example CSV Content

```csv
LRN,Name,Grade,Section,Sex,BirthDate,Address,Barangay,Municipality,Province,ContactNumber,LearningModality
1234567890,Juan Santos,Grade 7,A,Male,2008-05-15,123 Main Street,Tagumpay,Talakag,Bukidnon,09123456789,Face-to-Face
1234567891,Maria Cruz,Grade 7,B,Female,2008-08-20,456 Oak Avenue,Sumasama,Talakag,Bukidnon,09234567890,Online
1234567892,Pedro Reyes,Grade 8,A,Male,2008-03-10,789 Pine Road,Tagumpay,Talakag,Bukidnon,09345678901,Hybrid
1234567893,Angela Lopez,Grade 8,C,Female,2008-12-25,321 Cedar Lane,Sumasama,Talakag,Bukidnon,09456789012,Face-to-Face
```

## Tips for Best Results

✅ **Always backup your original file**
✅ **Test with a small batch first** (5-10 students)
✅ **Use consistent date format** (YYYY-MM-DD)
✅ **Use correct column headers** (spelling matters, but case doesn't)
✅ **Verify student data before importing** - check for duplicates and accuracy

---

For any issues or questions, contact the system administrator.
