# Workflow App

## Include a README file covering:

- Steps for running the app in development and production environments.
- External dependencies used and reasons for their selection.
- Tools used for continuous integration, testing, build, etc., and reasons for their selection.
- Small section with descriptions regarding architectural choices and other aspects, including discarded options and reasons for the final choice. Consider future app growth and its use as an intranet app not exposed to search engines.

## TASK LIST

### Set up project:

- [x] Test initialization of new Expo app
- [x] Install and test Virtual Devices with Android Studio and Expo
- [x] Run in a real device with Go
- [x] Create Git repository (automatic with Expo)

### Graphical Representation of Workflows

- [x] Testing libraries for shape representations
- [x] Choose library for shape representation
- [x] Create basic shapes as components
- [x] Paint basic shapes from data structure
- [x] Paint paths between shapes
- [x] View to paint the shapes based on coordinates object
- [x] Basic function to paint the paths based on coordinates of shapes
- [x] Function to resize the Canvas to the height and width of the workflow
- [x] Function to center de Canvas
- [ ] More advance function to paint paths starting and ending from specific places of shapes
- [ ] Make paths directional with an arrow
- [ ] Text for shapes
- [ ] Improve design of shapes

### Edit and Delete shapes

- [ ] Make the text of the shapes editable
- [ ] Delete shapes with a form
- [ ] Edit shapes, changing them from action to condition and condition to action ??

### Workflow Data Structure

- [x] Try out different Data Structures
- [x] Choose one Data Structure for workflow and nodes
- [x] Create workflow object
- [x] Create node objects
- [x] Simple nodes (Init, End, Action) and conditional nodes
- [x] Function to create new nodes, simple and conditional, with input
- [x] Determine initial workflow structure
- tried with single node for conditionas, having problems
- [x] Double node for conditional
- [x] Funcion to create new nodes at any point of the workflow

### Interaction with Gestures

- [x] Move the workflow to all directions
- [ ] Tap a line to create new components
- [ ] Tap the text of a shape to edit text
- [ ] Zoom in an out the workflow view
- [ ] Tap long a shape to edit/delete shape

### Workflow Algorithms

- [x] Function to orginize the shapes by levels (Fix)
- [x] Function to organize shapes in the Canvas based on levels and give out a coordinates object (Basic tree structure)
- [ ] (Extra) Implement auto adjusting structure to paint the shapes in the workflow

### Basic Navigation

- [x] Workflow page
- [ ] Navigation with tabs for more than one Workflow page
- [ ] Create new Workflow pages in a new tab
- [ ] Panel to go throw Workflow pages
- [ ] Create new Workflow page button in the Panel

### Session Management

- [ ] Save workflow when closing the app
- [ ] Saving all the workflows when clsing the app

### Animations

- [ ] Create an instructions panel shown for a few seconds at the start of the app

### Automated Tests
