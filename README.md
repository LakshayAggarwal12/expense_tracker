# Pennywise - AI-Assisted Debugging Workshop

A small expense tracker built with **HTML, CSS, and vanilla JavaScript**. The interface is ready, but the JavaScript contains intentional defects. Your task is to reproduce each issue, investigate its root cause with an AI assistant, make a focused fix, and verify the result.

> **Workshop rule:** Do not ask an AI tool to rewrite the entire project. Fix one defect at a time. Read and understand every suggested change.

## 1. Run the project

No Node.js, package installation, database, API key, or build step is needed.

1. Extract this ZIP.
2. Open the folder in VS Code or Google Antigravity.
3. Open `index.html` in a browser. VS Code Live Server is recommended but optional.
4. Try adding, searching, filtering, and deleting expenses.
5. Open Developer Tools (`F12`) and inspect the Console when debugging.

The app uses browser `localStorage`. To reset the sample data, clear this site's local storage in Developer Tools → Application/Storage → Local Storage, then reload.

## 2. Expected application behavior

- Show total expenses, current-month spending, and transaction count.
- Add an expense with title, amount, category, and date.
- Search transactions by title.
- Filter by category and month.
- Delete a selected transaction.
- Clear all transactions after confirmation.
- Restore saved transactions after refresh.

## 3. Debugging task cards

Each task gives the bug name and explains the symptom. Investigate the relevant function, ask AI to explain the root cause before suggesting a fix, and test the behavior afterwards.

### Task 1 - Numeric Type / String Concatenation
**Bug name:** Expense Total Concatenation

**Explanation:** The Total Expenses card can display an incorrect total after an expense is added. Values may appear joined together rather than mathematically added. Inspect the type of the amount coming from the form and how `reduce()` calculates the total. JavaScript input values are strings by default.

**Expected:** Total is the arithmetic sum of all expense amounts.

### Task 2 - Array Index vs. Unique ID
**Bug name:** Wrong Transaction Gets Deleted

**Explanation:** Clicking delete for one transaction may remove a different transaction, or the selected one may remain. The record's unique `id` and its position (index) in the array are not the same thing.

**Expected:** Only the record whose ID matches the clicked button is removed.

### Task 3 - Object Property Mismatch
**Bug name:** Category Filter Property Mismatch

**Explanation:** Choosing Food, Transport, or another category may show no matching records even though they exist. Compare the property names in the expense objects with the property accessed by the filter condition.

**Expected:** The selected category shows only matching records; “All categories” shows all records that match other filters.

### Task 4 - Case-Sensitive String Search
**Bug name:** Search Case Mismatch

**Explanation:** Searching `coffee` may fail to find a transaction titled `Coffee and sandwich`. Inspect how the search term and title are compared. Consider normalizing both strings before comparing.

**Expected:** Search is case-insensitive and supports partial title matches.

### Task 5 - Date Boundary / Missing Year
**Bug name:** Monthly Summary Includes the Wrong Year

**Explanation:** The “This month” total may include transactions from the same month in a different year. Comparing only the month number does not uniquely identify a calendar month.

**Expected:** Include only transactions from the current month and current year.

### Task 6 - Persistence Key Mismatch
**Bug name:** Saved Expenses Are Not Restored

**Explanation:** Add an expense and refresh. The app may return to sample data instead of restoring the saved list. Compare the key passed to `localStorage.setItem()` with the key passed to `localStorage.getItem()`. Keys must match exactly.

**Expected:** The same expense list is restored after refresh.

### Task 7 - Missing Numeric Validation
**Bug name:** Invalid Expense Amount Accepted

**Explanation:** The form may accept a negative amount or another invalid numeric value. Checking only whether the input is non-empty is not sufficient validation.

**Expected:** Accept only finite amounts greater than zero. Show a useful error and do not add invalid records.

### Task 8 - State and Persistence Out of Sync
**Bug name:** Clear All Does Not Persist

**Explanation:** Clear All empties the visible list, but refreshing may bring old expenses back. Compare the Clear All handler with the add and delete flows. Updating in-memory state and updating persistent storage are separate operations.

**Expected:** Once confirmed, the empty list remains empty after refresh.

### Task 9 - Regression Testing
**Bug name:** Fix Introduces a New Defect

**Explanation:** A fix may remove the original symptom but accidentally break another feature. This task is an integrated test pass rather than one seeded code defect.

**Expected:** All features work together after the fixes.

## 4. Suggested AI debugging workflow

Use this sequence:

1. **Reproduce:** Perform the action that triggers the issue.
2. **Observe:** Record expected and actual behavior.
3. **Isolate:** Find the function or code path involved.
4. **Diagnose:** Ask AI to explain the likely root cause before changing code.
5. **Fix:** Apply the smallest reasonable change.
6. **Verify:** Repeat the original test and check an edge case.
7. **Regression test:** Confirm previously working features still work.

### Example prompt

> I am debugging a vanilla JavaScript expense tracker. When I delete a transaction, a different transaction sometimes disappears. Expected behavior: only the clicked transaction should be removed. Please inspect the deletion logic, explain the root cause, and suggest the smallest change. Do not rewrite the whole file.

## 5. Bug report template

| Field | What to record |
|---|---|
| Feature | Which feature is affected? |
| Steps to reproduce | Exact actions that trigger the issue |
| Expected result | What should happen? |
| Actual result | What happens instead? |
| Console error | Any browser error, if present |
| Suspected area | Function or file that may be involved |

A precise bug report gives the AI useful evidence. “It doesn't work” is not a debugging report.

## 6. Verification checklist

- [ ] Total is correct after adding multiple expenses.
- [ ] Deleting one record removes the correct record.
- [ ] Category filtering works.
- [ ] Search ignores letter casing.
- [ ] Monthly summary checks month and year.
- [ ] Saved data is restored after refresh.
- [ ] Blank, zero, negative, and invalid amounts are rejected.
- [ ] Clear All remains cleared after refresh.
- [ ] Search, category, and month filters work together.
- [ ] No previously working feature regresses.

## 7. Project structure

```text
Expense-Tracker/
├── index.html
├── style.css
├── app.js
└── README.md
```

## 8. Notes

- This is a learning exercise, not a production finance application.
- Data is stored locally in the browser, not synced to a server.
- Do not enter real financial or personal information.
- No external JavaScript libraries or APIs are used.
- Sample dates and amounts are illustrative.
