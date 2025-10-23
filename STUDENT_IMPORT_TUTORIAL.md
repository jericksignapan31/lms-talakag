# How to Import Students - Step by Step Guide

## Quick Start
The easiest way to import students is using **CSV format**. Follow these simple steps:

## Method 1: Using CSV (Recommended - Works Best) ✅

### Step 1: Prepare Your CSV File

Create a file in Excel or Google Sheets with the following columns:

```
LRN,Name,Grade,Section,Sex,BirthDate,Address,Barangay,Municipality,Province,ContactNumber,LearningModality
```

### Step 2: Add Your Student Data

Example data (in Excel or Google Sheets):

| LRN | Name | Grade | Section | Sex | BirthDate | Address | Barangay | Municipality | Province | ContactNumber | LearningModality |
|-----|------|-------|---------|-----|-----------|---------|----------|--------------|----------|----------------|------------------|
| 1234567890 | Juan Santos | Grade 7 | A | Male | 2008-05-15 | 123 Main St | Tagumpay | Talakag | Bukidnon | 09123456789 | Face-to-Face |
| 1234567891 | Maria Cruz | Grade 7 | B | Female | 2008-08-20 | 456 Oak Ave | Sumasama | Talakag | Bukidnon | 09234567890 | Online |

### Step 3: Export as CSV

**From Microsoft Excel:**
1. File → Save As
2. Select format: **CSV (Comma delimited) (.csv)**
3. Click Save

**From Google Sheets:**
1. File → Download → Comma Separated Values (.csv)

### Step 4: Import to LMS

1. Go to **Students Management** page
2. Click the **"Import Excel"** button
3. Select your **CSV file**
4. Wait for the success message
5. Your students will appear in the table automatically

## Method 2: Using Excel Files (.xlsx or .xls)

If you have an Excel file, you can:
1. Open it in Excel
2. Save/Export as CSV (Comma Separated Values)
3. Then follow Method 1 above

**Or:** The system will try to import directly, but CSV format gives better results.

## What Information is Required?

### Must Have:
- **LRN** - Learning Reference Number (unique for each student)
- **Name** - Student's full name

### Optional (but recommended):
- Grade - Student's grade level
- Section - Class section
- Sex - Male or Female
- BirthDate - Date in YYYY-MM-DD format (e.g., 2008-05-15)
- Address - Street address
- Barangay - Barangay name
- Municipality - Municipality/City name
- Province - Province name
- ContactNumber - Phone number
- LearningModality - Face-to-Face, Online, or Hybrid

## Example CSV Content

Copy and paste this into a text editor and save as `.csv`:

```csv
LRN,Name,Grade,Section,Sex,BirthDate,Address,Barangay,Municipality,Province,ContactNumber,LearningModality
1234567890,Juan Santos,Grade 7,A,Male,2008-05-15,123 Main Street,Tagumpay,Talakag,Bukidnon,09123456789,Face-to-Face
1234567891,Maria Cruz,Grade 7,B,Female,2008-08-20,456 Oak Avenue,Sumasama,Talakag,Bukidnon,09234567890,Online
1234567892,Pedro Reyes,Grade 8,A,Male,2008-03-10,789 Pine Road,Tagumpay,Talakag,Bukidnon,09345678901,Hybrid
1234567893,Angela Lopez,Grade 8,C,Female,2008-12-25,321 Cedar Lane,Sumasama,Talakag,Bukidnon,09456789012,Face-to-Face
```

## What Happens When You Import?

✅ **For each student imported:**
1. Student record is created in the database
2. Firebase Authentication account is created
3. Account Email: `{LRN}@lms.talakag`
4. Account Password: `{LRN}@123`

**Example:**
- LRN: 1234567890
- Email: 1234567890@lms.talakag
- Password: 1234567890@123

## Important Notes

⚠️ **Duplicate LRNs:**
- Each LRN must be unique
- If a student with the same LRN already exists, they will be skipped
- The import summary shows how many were imported vs skipped

⚠️ **Required Fields:**
- If LRN or Name is missing, that row will be skipped
- Check your data before importing

⚠️ **Date Format:**
- Always use YYYY-MM-DD format for dates
- Examples: 2008-05-15, 2008-12-25

⚠️ **Phone Numbers:**
- Include country code if needed
- Examples: 09123456789, +63-912-345-6789

## Troubleshooting

### Import shows "0 imported"
- Check if LRN and Name columns have values
- Verify all students don't already exist in system
- Try using CSV format instead of Excel

### "File must have headers and at least one row"
- Make sure first row has column names (headers)
- Make sure there's at least one data row below headers

### File won't upload
- Only .csv, .xlsx, and .xls files are supported
- Try exporting Excel as CSV format
- Ensure file is not corrupted

### Date errors
- Use format: YYYY-MM-DD (e.g., 2008-05-15)
- NOT: MM/DD/YYYY or DD/MM/YYYY

## Video Tutorial

Coming soon! Check back for step-by-step video guide.

## Tips for Best Results

✅ **Always test first** - Import 2-3 students to verify format works
✅ **Remove extra columns** - Only include needed columns
✅ **Check for duplicates** - Ensure no duplicate LRNs in your data
✅ **Use consistent formatting** - Keep data format consistent throughout
✅ **Backup your file** - Always keep a copy of your import file
✅ **Go slow** - You can import multiple times, so no rush!

## Need Help?

Contact your system administrator if you need assistance with:
- Exporting data from your existing system
- Formatting student data
- Troubleshooting import issues

---

**Remember:** CSV format is your best friend for importing data! 📊

