# Stlightbox - JavaScript Lightbox Plugin

Stlightbox is a lightweight and customizable JavaScript lightbox plugin that allows you to display images and videos in a beautiful overlay with various configuration options.

## Features

-   Display images and videos in a responsive lightbox.
-   Customizable appearance and behavior.
-   Keyboard navigation for easy gallery navigation.
-   Download button for image downloads.
-   Pagination support to show the current image position.
-   Dark and light themes with automatic theme detection.

## Installation

You can install Stlightbox by including the JavaScript and CSS files in your project. You can download the latest release from the [GitHub repository](https://github.com/madac4/stlightbox) or use a package manager like npm or yarn:

```bash
npm install stlightbox
```

## Usage

To use Stlightbox in your project, follow these simple steps:

1. Include the CSS in your h:

```html
<link rel="stylesheet" href="path/to/stlightbox.css" />

<script src="path/to/stlightbox.js"></script>
```

2. Wrap your image or video i <a> tag with the same href. Add the **data-stlightbox** attribute to the <a> tag you want to include in the lightbox:

```html
<!-- FIRST GALLERY -->
<a href="image1.jpg" data-stlightbox="stellar-solutions">
    <img src="image1.jpg" alt="Image 1" />
</a>
<a href="image2.jpg" data-stlightbox="stellar-solutions">
    <img src="image2.jpg" alt="Image 2" />
</a>

<!-- SECOND GALLERY -->
<a href="image3.jpg" data-stlightbox="stl-gallery">
    <img src="image3.jpg" alt="Image 3" />
</a>
<a href="image4.jpg" data-stlightbox="stl-gallery">
    <img src="image4.jpg" alt="Image 4" />
</a>
```

3. Initialize Stlightbox in your JavaScript code:

```js
const lightbox = new Stlightbox({
    // Configuration options (see below)
});

lightbox.initialize();
```

4. Customize the appearance and behavior of the lightbox by providing configuration options (see the Configuration section below).

## Configuration

You can customize the behavior and appearance of Stlightbox by passing configuration options when initializing it. Here are the available options:

-   lightThemeBackground: Background color for the light theme (default: 'rgba(255, 255, 255, 0.5)').
-   darkThemeBackground: Background color for the dark theme (default: 'rgba(100, 100, 100, 0.5)').
-   paginationSeparator: Separator between current and total in pagination (default: 'of').
-   showDownloadButton: Show a download button for images (default: false).
-   keyboardControls: Enable keyboard navigation (default: true).
-   videoAutoplay: Autoplay videos in the lightbox (default: false).
-   pagination: Show pagination (default: false).
-   loop: Enable loop navigation (default: false).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/madac4/stlightbox/blob/main/LICENCE) file for details.

## Acknowledgments

Icons used in the lightbox are provided by [Heroicons](https://heroicons.com/).

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
