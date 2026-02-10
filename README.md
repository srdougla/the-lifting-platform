# The Lifting Platform 🏋️

### Created by Shannon Douglas


A comprehensive, interactive web application designed for Olympic weightlifters to track progress, manage training programs, and improve technique. This full-stack single-page application (SPA) provides athletes with all the tools they need to excel in their sport.

---

## Project Overview

**The Lifting Platform** is a feature-rich weightlifting companion that combines training management, progress tracking, and educational resources into one cohesive platform. Built with vanilla JavaScript, HTML5, and CSS3, this application demonstrates advanced front-end development techniques including persistent data storage, dynamic DOM manipulation, and responsive design principles.

---

## Page-by-Page Technical Breakdown

### 1. `index.html` - Dashboard Home
**Purpose:** Landing page providing a personalized overview of the athlete's training status

**Key Technical Concepts:**
- LocalStorage data retrieval and dynamic content population
- Flexbox stat cards with gradient backgrounds
- Conditional rendering based on stored profile data
- Event listeners for navigation
- DOM element selection and text content updates

---

### 2. `profile.html` - User Profile Display
**Purpose:** Read-only view of athlete's complete profile information

**Key Technical Concepts:**
- Data retrieval from localStorage (`profileData` object)
- Conditional rendering (displays placeholder if data missing)
- Base64 image handling for profile pictures
- Unit conversion functions (lbs → kg)
- Flexbox layout with profile card styling
- Computed properties (total PR calculation)

---

### 3. `editprofile.html` - Profile Management
**Purpose:** Form-based interface for creating and updating user profiles

**Key Technical Concepts:**
- HTML5 form elements (text, number, radio, file inputs)
- Form pre-population using existing localStorage data
- Client-side form validation with `required` attributes
- File API for image upload and FileReader for base64 conversion
- Radio button groups for mutually exclusive selections
- Fieldset and legend semantic structure
- Form submit event handling with `preventDefault()`
- JSON serialization before localStorage storage
- Redirect after successful save

---

### 4. `journal.html` - Directory Hub
**Purpose:** Navigation portal to four journaling sub-features

**Key Technical Concepts:**
- Flexbox image grid with responsive wrapping
- CSS hover effects with transforms
- Image asset management
- Link-based navigation to sub-pages
- Responsive layout with media queries

---

### 5. `myprs.html` - Personal Records Tracker
**Purpose:** Comprehensive PR management with historical tracking

**Key Technical Concepts:**
- Dynamic HTML table generation
- Array manipulation methods (push, filter, map, sort)
- Date object handling and formatting
- Dropdown select elements populated with lift options
- Form submission with data validation
- LocalStorage array management
- Sorting algorithms (by date, by weight)
- Table row creation via `createElement()` and `appendChild()`
- Delete functionality with array filtering

---

### 6. `goals.html` - Goal Setting & Tracking
**Purpose:** SMART goal management with priority levels and deadlines

**Key Technical Concepts:**
- Card-based UI with dynamic generation
- Form handling for goal creation
- LocalStorage CRUD operations (Create, Read, Update, Delete)
- Date calculations for "days remaining"
- Conditional CSS classes based on priority level
- Edit mode with form pre-population
- Toggle visibility between view/edit states
- Completion tracking with visual feedback
- CSS Grid for responsive card layout

---

### 7. `notes.html` - Journal Entries
**Purpose:** Simple note-taking interface with title and content

**Key Technical Concepts:**
- Automatic date stamping with JavaScript Date objects
- Textarea handling for multi-line content
- LocalStorage persistence of entries array
- Dynamic entry card generation
- Edit/delete functionality with modal or inline forms
- Toggle between view and edit modes
- Unique ID generation using timestamps
- White-space preservation with `white-space: pre-wrap`

---

### 8. `gallery.html` - Photo Progress Gallery
**Purpose:** Visual progress tracking through photo uploads

**Key Technical Concepts:**
- File input handling for image uploads
- FileReader API for converting images to base64
- LocalStorage management of image data (size considerations)
- CSS Grid masonry-style layout
- Hover effects with caption overlays
- Delete functionality with confirmation
- Responsive image sizing
- Optional: Caption input fields
- Array methods for gallery management

---

### 9. `bar.html` - Bar Loading Game
**Purpose:** Interactive training game for practicing Olympic barbell loading

**Key Technical Concepts:**
- **Game logic algorithm:** Generate random weight (20-300kg)
- **Plate calculation algorithm:** Determine optimal plate combination
- **Visual barbell rendering:** CSS positioning and Flexbox for plates
- **Drag-and-drop or click-to-add** plate mechanics
- **State management:** Track current bar weight and plate configuration
- **Validation logic:** Check total weight AND plate order
- **Feedback modal system:** Display correct/incorrect results
- **Collision rules:** Enforce proper plate ordering (collars, change plates)
- **Reset functionality:** Clear bar and start new round
- **CSS transforms and gradients** for realistic plate appearance
- **Event delegation** for plate interactions
- **Custom Drawings** created for all of the plates!

---

### 10. `program.html` - Training Program Builder
**Purpose:** Custom program creation with automatic weight calculations

**Key Technical Concepts:**
- **Multi-level form structure:** Weeks → Days → Exercises → Sets
- **Dynamic form generation:** Create week cards based on user input
- **Nested DOM manipulation:** Build complex hierarchical structures
- **Dropdown menus** for exercise selection (tracked lifts vs. custom)
- **Conditional form fields:** Show/hide custom exercise input
- **Percentage-based calculations:** Retrieve PRs from localStorage
- **Weight computation algorithm:** Calculate actual weights from percentages
- **Unit conversion:** Handle lbs/kg conversions
- **LocalStorage program management:** Save, retrieve, edit, delete programs
- **Edit mode with pre-population:** Load existing program data into form
- **Program display rendering:** Generate formatted program view
- **Update vs. Create logic:** Preserve program IDs when editing
- **Card-based UI** with visual hierarchy (weeks > days > exercises)

---

### 11. `info.html` - Percentage Calculator
**Purpose:** Calculate training percentages and view PR-based percentage tables

**Key Technical Concepts:**
- HTML table generation from PR data
- Mathematical calculations (percentage of max)
- Two-way calculator (weight → % and % → weight)
- Input event listeners for real-time calculation
- Number formatting and rounding
- Dynamic result display
- LocalStorage PR retrieval
- Formula application: `weight = (PR × percentage) / 100`
- Responsive table styling with highlighted columns

---

### 12. `technique.html` - Video Library
**Purpose:** Educational resource with embedded technique videos

**Key Technical Concepts:**
- Sidebar navigation menu
- Show/hide content toggling based on user selection
- Embedded iframe videos (YouTube, Vimeo)
- Event listeners on navigation items
- CSS transitions for smooth content changes
- Active state styling for selected menu item
- Flexbox layout with sidebar and content area
- Video descriptions with text content
- Responsive design for mobile video viewing

---

## Key Algorithms & Logic

### Plate Loading Algorithm (`bar.html`)
Determines the optimal combination of Olympic plates to load a target weight:
1. Calculate per-side weight: `(totalWeight - barWeight) / 2`
2. Determine if bumper plates needed (< 12.5kg per side)
3. Allocate collars (2.5kg) if using metal plates
4. Greedy algorithm: Select largest plates first
5. Enforce ordering rules: big plates → change plates (5kg, 2.5kg) → collars → small change plates

### Weight Calculation (`program.html`)
Converts percentages to actual training weights:
1. Retrieve user's PR from localStorage
2. Convert to kg if stored in lbs: `weight / 2.20462`
3. Calculate: `(PR × percentage) / 100`
4. Round to nearest whole kilogram

### Goal Days Remaining (`goals.html`)
Calculate days until goal deadline:
1. Parse target date string to Date object
2. Get current date
3. Calculate difference in milliseconds
4. Convert to days: `Math.ceil(diff / (1000 * 60 * 60 * 24))`
5. Apply conditional styling (green if positive, red if overdue)


## Future Ideas

- User authentication and multi-user support
- Social features (share PRs, programs)
- Advanced analytics and progress graphs
- Weight calculator: creates a diet for a user to gain or lose weight
- Mobile app version
- Video upload capability
- Coach/athlete collaborative features
- Export programs to PDF
- Integration with wearable fitness devices
- Blog feature for well-known coaches/lifters