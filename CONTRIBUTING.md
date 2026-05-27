# Contributing to CS-GRADES 🤝

We welcome all contributions to make CS-GRADES better! Whether you are a student adding your university's curriculum, fixing a bug, or polishing the user interface, your support is highly appreciated.

Follow these simple guidelines to contribute.

---

## 🗺️ Adding a New Curriculum / Specialty

All curriculum data resides in [src/database/curriculum.js](file:///c:/Users/xWantedStore/Documents/GitHub/CS-GRADES/src/database/curriculum.js). 

To add a new Year or Specialty:
1. Open the curriculum file.
2. Locate the exported `CURRICULUM` object.
3. Add or update the target academic year and its specialties following this schema structure:

```javascript
export const CURRICULUM = {
  "Your Academic Year": {
    specialties: {
      "Your Specialty Name": {
        semesters: {
          "Semester 1": [
            { id: "mod-1", name: "Subject Name", coef: 3, credit: 5 },
            { id: "mod-2", name: "Another Subject", coef: 2, credit: 4 }
          ],
          "Semester 2": [
            // ...
          ]
        }
      }
    }
  }
};
```

---

## 🎨 UI & UX Design Guidelines

To keep the application pristine, consistent, and premium:
- **OLED Dark Mode**: Always use absolute true-black background color `#000000` with high-contrast text to preserve battery life and look extremely premium on mobile screens.
- **Accents**: Use elegant, harmonized gradients or specific slate/charcoal tones (e.g. `#111111` card backdrops, `#8B5CF6` / `#3B82F6` gradients for active tabs or headers). Avoid bright default reds/greens.
- **Interactive Micro-actions**: Keep component tap targets spacious (at least 48dp height) and use elegant subtle feedback transitions.
- **Form Inputs**: Ensure numerical inputs handle unexpected strings gracefully and automatically treat empty fields as `0` for running SGPA calculations.

---

## 🔄 Contribution Workflow

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Commit Your Changes**: Keep commit messages clear, descriptive, and concise.
4. **Push Your Branch**:
   ```bash
   git push origin feature/amazing-new-feature
   ```
5. **Open a Pull Request**: Submit your pull request description clearly explaining the modification and its benefits.

---

## 🛠️ Testing Your Changes

Before submitting your pull request, verify that the Expo app compiles cleanly without warnings or errors:

```bash
npx expo export
```

This verifies that the compilation and static export build works perfectly for production without any syntax or bundling errors.

Thank you for contributing to CS-GRADES! 🚀
