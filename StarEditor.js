/**
 * StarEditor - Lightweight rich text editor without external dependencies
 *
 * A simple, customizable WYSIWYG editor that transforms a textarea into a rich text editor
 * using native browser APIs (contenteditable, execCommand).
 *
 * @package StarEditor
 * @version 3.0.0
 * @license MIT
 */
class StarEditor {
    /**
     * Whether styles have been injected into the document
     * @type {boolean}
     */
    static stylesInjected = false;

    /**
     * Whether the removed-`toolbar`-option deprecation warning has already been logged
     * @type {boolean}
     */
    static toolbarOptionWarned = false;

    /**
     * Default configuration options
     * @type {Object}
     */
    static defaults = {
        placeholder: '',
        pasteAsPlainText: false,
        minHeight: '200px',
        maxHeight: null,
        onChange: null,
        onFocus: null,
        onBlur: null,
        onImageInsert: null,
        shortcuts: true,
        classPrefix: 'star',
        linkTargetBlank: true,
        fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'],
        fontFamilies: [
            { label: 'Arial', value: 'Arial, sans-serif' },
            { label: 'Times New Roman', value: '"Times New Roman", serif' },
            { label: 'Georgia', value: 'Georgia, serif' },
            { label: 'Courier New', value: '"Courier New", monospace' },
            { label: 'Verdana', value: 'Verdana, sans-serif' },
            { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' }
        ],
        colorPalette: [
            '#000000', '#434343', '#666666', '#999999', '#cccccc', '#ffffff',
            '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff',
            '#9900ff', '#ff00ff', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3',
            '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'
        ],
        tableDefaults: { rows: 3, cols: 3 },
        imageUpload: true,
        maxImageSize: 5242880,
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        serverImages: null,
        serverImagesPageSize: 16,
        locale: 'auto',
        serverGalleries: null,
        serverGalleriesPageSize: 12,
        onGalleryInsert: null,
        onContentIn: null,
        onContentOut: null,
        onImageUpload: null
    };

    /**
     * Translation strings for supported locales
     * @type {Object}
     */
    static translations = {
        en: {
            // Toolbar button tooltips
            'toolbar.bold': 'Bold (Ctrl+B)',
            'toolbar.italic': 'Italic (Ctrl+I)',
            'toolbar.underline': 'Underline (Ctrl+U)',
            'toolbar.strikethrough': 'Strikethrough',
            'toolbar.subscript': 'Subscript',
            'toolbar.superscript': 'Superscript',
            'toolbar.heading': 'Heading',
            'toolbar.h1': 'Heading 1',
            'toolbar.h2': 'Heading 2',
            'toolbar.h3': 'Heading 3',
            'toolbar.h4': 'Heading 4',
            'toolbar.h5': 'Heading 5',
            'toolbar.h6': 'Heading 6',
            'toolbar.blockquote': 'Block Quote',
            'toolbar.pre': 'Preformatted Block',
            'toolbar.ul': 'Bullet List',
            'toolbar.ol': 'Numbered List',
            'toolbar.hr': 'Horizontal Rule',
            'toolbar.link': 'Insert Link (Ctrl+K)',
            'toolbar.unlink': 'Remove Link',
            'toolbar.alignment': 'Alignment',
            'toolbar.alignLeft': 'Align Left',
            'toolbar.alignCenter': 'Align Center',
            'toolbar.alignRight': 'Align Right',
            'toolbar.justifyFull': 'Justify',
            'toolbar.indent': 'Increase Indent',
            'toolbar.outdent': 'Decrease Indent',
            'toolbar.undo': 'Undo (Ctrl+Z)',
            'toolbar.redo': 'Redo (Ctrl+Y)',
            'toolbar.clearFormat': 'Clear Formatting',
            'toolbar.fontSize': 'Font Size',
            'toolbar.fontName': 'Font Family',
            'toolbar.fontNameDefault': 'Font',
            'toolbar.textColor': 'Text Color',
            'toolbar.bgColor': 'Background Color',
            'toolbar.table': 'Insert Table',
            'toolbar.image': 'Insert Image',
            'toolbar.codeView': 'View HTML Source',

            // Link prompt
            'prompt.enterUrl': 'Enter URL:',

            // Color picker
            'colorPicker.remove': 'Remove',

            // Table modal
            'modal.insertTable': 'Insert Table',
            'modal.rows': 'Rows',
            'modal.columns': 'Columns',

            // Image modal
            'modal.insertImage': 'Insert Image',
            'modal.tabServer': 'Server',
            'modal.tabUpload': 'Upload',
            'modal.tabUrl': 'URL',
            'modal.imageUrl': 'Image URL',
            'modal.selectImage': 'Select Image',
            'modal.altText': 'Alt Text',
            'modal.altPlaceholder': 'Image description',
            'modal.serverLoading': 'Loading…',
            'modal.serverEmpty': 'No images found in the configured folder.',
            'modal.serverNotConfigured': 'Server gallery is not configured.',
            'modal.serverError': 'Could not load images.',
            'modal.serverNoResults': 'No images match your search.',
            'modal.serverSearch': 'Search…',
            'modal.serverFolders': 'Folders',
            'modal.serverRoot': 'Root',
            'modal.serverPagePrev': 'Previous',
            'modal.serverPageNext': 'Next',
            'modal.serverPageOf': 'Page %1 of %2',
            'modal.retry': 'Retry',

            // Alt text edit modal
            'modal.editAltText': 'Edit Alt Text',

            // Table properties modal
            'modal.tableProperties': 'Table Properties',
            'modal.borderWidth': 'Border Width (px)',
            'modal.borderColor': 'Border Color',
            'modal.cellPadding': 'Cell Padding (px)',
            'modal.tableWidth': 'Table Width (%)',

            // Shared modal buttons
            'modal.cancel': 'Cancel',
            'modal.insert': 'Insert',
            'modal.save': 'Save',
            'modal.apply': 'Apply',

            // Image toolbar
            'imageToolbar.editAlt': 'Edit alt text',
            'imageToolbar.resize50': '50% size',
            'imageToolbar.resize100': 'Original size',
            'imageToolbar.delete': 'Delete image',

            // Table toolbar
            'tableToolbar.properties': 'Table properties',
            'tableToolbar.rowAbove': 'Insert row above',
            'tableToolbar.rowBelow': 'Insert row below',
            'tableToolbar.colLeft': 'Insert column left',
            'tableToolbar.colRight': 'Insert column right',
            'tableToolbar.deleteRow': 'Delete row',
            'tableToolbar.deleteCol': 'Delete column',
            'tableToolbar.deleteTable': 'Delete table',

            // Table toolbar button labels
            'tableToolbar.propertiesLabel': 'Properties',
            'tableToolbar.rowAboveLabel': 'Row',
            'tableToolbar.rowBelowLabel': 'Row',
            'tableToolbar.colLeftLabel': 'Col',
            'tableToolbar.colRightLabel': 'Col',
            'tableToolbar.deleteRowLabel': 'Row',
            'tableToolbar.deleteColLabel': 'Col',
            'tableToolbar.deleteTableLabel': 'Table',

            // Alert messages
            'alert.invalidImageType': 'Invalid image type. Allowed: ',
            'alert.imageTooLarge': 'Image too large. Maximum size: ',

            // Gallery picker
            'toolbar.gallery': 'Insert gallery',
            'modal.galleryPickerTitle': 'Select gallery',
            'modal.galleryEmpty': 'No galleries available.',
            'modal.galleryImageCount': '%d images',
            'modal.galleryError': 'Failed to load galleries.',
            'modal.galleryNotConfigured': 'Gallery source not configured.'
        },

        hu: {
            // Toolbar button tooltips
            'toolbar.bold': 'Félkövér (Ctrl+B)',
            'toolbar.italic': 'Dőlt (Ctrl+I)',
            'toolbar.underline': 'Aláhúzott (Ctrl+U)',
            'toolbar.strikethrough': 'Áthúzott',
            'toolbar.subscript': 'Alsó index',
            'toolbar.superscript': 'Felső index',
            'toolbar.heading': 'Címsor',
            'toolbar.h1': 'Címsor 1',
            'toolbar.h2': 'Címsor 2',
            'toolbar.h3': 'Címsor 3',
            'toolbar.h4': 'Címsor 4',
            'toolbar.h5': 'Címsor 5',
            'toolbar.h6': 'Címsor 6',
            'toolbar.blockquote': 'Idézetblokk',
            'toolbar.pre': 'Előformázott blokk',
            'toolbar.ul': 'Felsorolás',
            'toolbar.ol': 'Számozott lista',
            'toolbar.hr': 'Vízszintes vonal',
            'toolbar.link': 'Hivatkozás beszúrása (Ctrl+K)',
            'toolbar.unlink': 'Hivatkozás eltávolítása',
            'toolbar.alignment': 'Igazítás',
            'toolbar.alignLeft': 'Balra igazítás',
            'toolbar.alignCenter': 'Középre igazítás',
            'toolbar.alignRight': 'Jobbra igazítás',
            'toolbar.justifyFull': 'Sorkizárás',
            'toolbar.indent': 'Behúzás növelése',
            'toolbar.outdent': 'Behúzás csökkentése',
            'toolbar.undo': 'Visszavonás (Ctrl+Z)',
            'toolbar.redo': 'Újra (Ctrl+Y)',
            'toolbar.clearFormat': 'Formázás törlése',
            'toolbar.fontSize': 'Betűméret',
            'toolbar.fontName': 'Betűtípus',
            'toolbar.fontNameDefault': 'Betűtípus',
            'toolbar.textColor': 'Szövegszín',
            'toolbar.bgColor': 'Háttérszín',
            'toolbar.table': 'Táblázat beszúrása',
            'toolbar.image': 'Kép beszúrása',
            'toolbar.codeView': 'HTML forráskód',

            // Link prompt
            'prompt.enterUrl': 'Add meg az URL-t:',

            // Color picker
            'colorPicker.remove': 'Eltávolítás',

            // Table modal
            'modal.insertTable': 'Táblázat beszúrása',
            'modal.rows': 'Sorok',
            'modal.columns': 'Oszlopok',

            // Image modal
            'modal.insertImage': 'Kép beszúrása',
            'modal.tabServer': 'Szerver',
            'modal.tabUpload': 'Feltöltés',
            'modal.tabUrl': 'URL',
            'modal.imageUrl': 'Kép URL',
            'modal.selectImage': 'Kép kiválasztása',
            'modal.altText': 'Alt szöveg',
            'modal.altPlaceholder': 'Kép leírása',
            'modal.serverLoading': 'Betöltés…',
            'modal.serverEmpty': 'Nincs kép a beállított mappában.',
            'modal.serverNotConfigured': 'A szerver galéria nincs beállítva.',
            'modal.serverError': 'A képek betöltése sikertelen.',
            'modal.serverNoResults': 'Nincs találat.',
            'modal.serverSearch': 'Keresés…',
            'modal.serverFolders': 'Mappák',
            'modal.serverRoot': 'Gyökér',
            'modal.serverPagePrev': 'Előző',
            'modal.serverPageNext': 'Következő',
            'modal.serverPageOf': '%1. oldal / %2',
            'modal.retry': 'Újra',

            // Alt text edit modal
            'modal.editAltText': 'Alt szöveg szerkesztése',

            // Table properties modal
            'modal.tableProperties': 'Táblázat tulajdonságai',
            'modal.borderWidth': 'Szegély szélesség (px)',
            'modal.borderColor': 'Szegély szín',
            'modal.cellPadding': 'Cella kitöltés (px)',
            'modal.tableWidth': 'Táblázat szélesség (%)',

            // Shared modal buttons
            'modal.cancel': 'Mégse',
            'modal.insert': 'Beszúrás',
            'modal.save': 'Mentés',
            'modal.apply': 'Alkalmaz',

            // Image toolbar
            'imageToolbar.editAlt': 'Alt szöveg szerkesztése',
            'imageToolbar.resize50': '50% méret',
            'imageToolbar.resize100': 'Eredeti méret',
            'imageToolbar.delete': 'Kép törlése',

            // Table toolbar
            'tableToolbar.properties': 'Táblázat tulajdonságai',
            'tableToolbar.rowAbove': 'Sor beszúrása fölé',
            'tableToolbar.rowBelow': 'Sor beszúrása alá',
            'tableToolbar.colLeft': 'Oszlop beszúrása balra',
            'tableToolbar.colRight': 'Oszlop beszúrása jobbra',
            'tableToolbar.deleteRow': 'Sor törlése',
            'tableToolbar.deleteCol': 'Oszlop törlése',
            'tableToolbar.deleteTable': 'Táblázat törlése',

            // Table toolbar button labels
            'tableToolbar.propertiesLabel': 'Tulajdonságok',
            'tableToolbar.rowAboveLabel': 'Sor',
            'tableToolbar.rowBelowLabel': 'Sor',
            'tableToolbar.colLeftLabel': 'Oszlop',
            'tableToolbar.colRightLabel': 'Oszlop',
            'tableToolbar.deleteRowLabel': 'Sor',
            'tableToolbar.deleteColLabel': 'Oszlop',
            'tableToolbar.deleteTableLabel': 'Táblázat',

            // Alert messages
            'alert.invalidImageType': 'Érvénytelen képformátum. Engedélyezett: ',
            'alert.imageTooLarge': 'A kép túl nagy. Maximális méret: ',

            // Gallery picker
            'toolbar.gallery': 'Galéria beszúrása',
            'modal.galleryPickerTitle': 'Galéria kiválasztása',
            'modal.galleryEmpty': 'Nincs elérhető galéria.',
            'modal.galleryImageCount': '%d kép',
            'modal.galleryError': 'A galériák betöltése sikertelen.',
            'modal.galleryNotConfigured': 'Galériaforrás nincs beállítva.'
        }
    };

    /**
     * Fixed toolbar layout — always rendered in full, identical across every embedding.
     * @type {string[]}
     */
    static toolbarLayout = [
        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
        'fontSize', 'fontName', '|',
        'textColor', 'bgColor', '|',
        'heading', '|',
        'ul', 'ol', 'blockquote', 'pre', '|',
        'link', 'unlink', '|',
        'alignment', '|',
        'indent', 'outdent', '|',
        'hr', 'table', 'image', 'gallery', '|',
        'undo', 'redo', '|',
        'clearFormat', 'codeView'
    ];

    /**
     * Monochrome SVG toolbar icon set, sourced from SunEditor (JiHong88/SunEditor,
     * src/assets/icons/defaultIcons.js, MIT license, Copyright (c) 2017-2025 Yi JiHong).
     * Each value is a bare <svg> string injected via innerHTML; fill is left to CSS so
     * every icon inherits the button's currentColor.
     * @type {Object<string, string>}
     */
    static icons = {
        bold: '<svg class="se-ci" viewBox="0 0 384 512"><path d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z"/></svg>',
        italic: '<svg viewBox="0 0 24 24"><path d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z" /></svg>',
        underline: '<svg class="se-ci" viewBox="0 0 9.78 15.74"><g><path d="M14.64,3.76h2.52v7.72a4.51,4.51,0,0,1-.59,2.31,3.76,3.76,0,0,1-1.71,1.53,6.12,6.12,0,0,1-2.64.53,5,5,0,0,1-3.57-1.18,4.17,4.17,0,0,1-1.27-3.24V3.76H9.9v7.3a3,3,0,0,0,.55,2,2.3,2.3,0,0,0,1.83.65,2.26,2.26,0,0,0,1.8-.65,3.09,3.09,0,0,0,.55-2V3.76Zm2.52,13.31V19.5H7.39V17.08h9.77Z" transform="translate(-7.38 -3.76)"/></g></svg>',
        strike: '<svg viewBox="0 0 24 24"><path d="M7.2 9.8C6 7.5 7.7 4.8 10.1 4.3C13.2 3.3 17.7 4.7 17.6 8.5H14.6C14.6 8.2 14.5 7.9 14.5 7.7C14.3 7.1 13.9 6.8 13.3 6.6C12.5 6.3 11.2 6.4 10.5 6.9C9 8.2 10.4 9.5 12 10H7.4C7.3 9.9 7.3 9.8 7.2 9.8M21 13V11H3V13H12.6C12.8 13.1 13 13.1 13.2 13.2C13.8 13.5 14.3 13.7 14.5 14.3C14.6 14.7 14.7 15.2 14.5 15.6C14.3 16.1 13.9 16.3 13.4 16.5C11.6 17 9.4 16.3 9.5 14.1H6.5C6.4 16.7 8.6 18.5 11 18.8C14.8 19.6 19.3 17.2 17.3 12.9L21 13Z" /></svg>',
        subscript: '<svg viewBox="0 0 24 24"><path d="M16,7.41L11.41,12L16,16.59L14.59,18L10,13.41L5.41,18L4,16.59L8.59,12L4,7.41L5.41,6L10,10.59L14.59,6L16,7.41M21.85,21.03H16.97V20.03L17.86,19.23C18.62,18.58 19.18,18.04 19.56,17.6C19.93,17.16 20.12,16.75 20.13,16.36C20.14,16.08 20.05,15.85 19.86,15.66C19.68,15.5 19.39,15.38 19,15.38C18.69,15.38 18.42,15.44 18.16,15.56L17.5,15.94L17.05,14.77C17.32,14.56 17.64,14.38 18.03,14.24C18.42,14.1 18.85,14 19.32,14C20.1,14.04 20.7,14.25 21.1,14.66C21.5,15.07 21.72,15.59 21.72,16.23C21.71,16.79 21.53,17.31 21.18,17.78C20.84,18.25 20.42,18.7 19.91,19.14L19.27,19.66V19.68H21.85V21.03Z" /></svg>',
        superscript: '<svg viewBox="0 0 24 24"><path d="M16,7.41L11.41,12L16,16.59L14.59,18L10,13.41L5.41,18L4,16.59L8.59,12L4,7.41L5.41,6L10,10.59L14.59,6L16,7.41M21.85,9H16.97V8L17.86,7.18C18.62,6.54 19.18,6 19.56,5.55C19.93,5.11 20.12,4.7 20.13,4.32C20.14,4.04 20.05,3.8 19.86,3.62C19.68,3.43 19.39,3.34 19,3.33C18.69,3.34 18.42,3.4 18.16,3.5L17.5,3.89L17.05,2.72C17.32,2.5 17.64,2.33 18.03,2.19C18.42,2.05 18.85,2 19.32,2C20.1,2 20.7,2.2 21.1,2.61C21.5,3 21.72,3.54 21.72,4.18C21.71,4.74 21.53,5.26 21.18,5.73C20.84,6.21 20.42,6.66 19.91,7.09L19.27,7.61V7.63H21.85V9Z" /></svg>',
        text_style: '<svg viewBox="0 0 24 24"><path d="M3,3H16V6H11V18H8V6H3V3M12,7H14V9H12V7M15,7H17V9H15V7M18,7H20V9H18V7M12,10H14V12H12V10M12,13H14V15H12V13M12,16H14V18H12V16M12,19H14V21H12V19Z" /></svg>',
        menu_arrow_down: '<svg viewBox="0 0 24 24"><path d="M7,10L12,15L17,10H7Z" /></svg>',
        font_color: '<svg viewBox="0 0 24 24"><g><path d="M9.62,12L12,5.67L14.37,12M11,3L5.5,17H7.75L8.87,14H15.12L16.25,17H18.5L13,3H11Z" /><path class="star-svg-color-bar" d="M0,24H24V20H0V24Z" /></g></svg>',
        background_color: '<svg viewBox="0 0 24 24"><g><path d="M4,17L6.75,14.25L6.72,14.23C6.14,13.64 6.14,12.69 6.72,12.11L11.46,7.37L15.7,11.61L10.96,16.35C10.39,16.93 9.46,16.93 8.87,16.37L8.24,17H4M15.91,2.91C16.5,2.33 17.45,2.33 18.03,2.91L20.16,5.03C20.74,5.62 20.74,6.57 20.16,7.16L16.86,10.45L12.62,6.21L15.91,2.91Z" /><path class="star-svg-color-bar" d="M0,24H24V20H0V24Z" /></g></svg>',
        list_bulleted: '<svg class="se-ci" viewBox="0 0 15.74 12.37"><g><path d="M7.77,16.12a1.59,1.59,0,0,0-.49-1.18,1.62,1.62,0,0,0-1.19-.49,1.68,1.68,0,1,0,0,3.36,1.67,1.67,0,0,0,1.68-1.69Zm0-4.48A1.67,1.67,0,0,0,6.09,10,1.68,1.68,0,0,0,4.9,12.82a1.62,1.62,0,0,0,1.19.49,1.67,1.67,0,0,0,1.68-1.67Zm12.38,3.64a.27.27,0,0,0-.08-.19.28.28,0,0,0-.2-.09H9.19a.28.28,0,0,0-.2.08.29.29,0,0,0-.08.19V17a.27.27,0,0,0,.28.28H19.87a.27.27,0,0,0,.19-.08.24.24,0,0,0,.08-.2V15.28ZM7.77,7.13a1.63,1.63,0,0,0-.49-1.2,1.61,1.61,0,0,0-1.19-.49,1.61,1.61,0,0,0-1.19.49,1.71,1.71,0,0,0,0,2.4,1.62,1.62,0,0,0,1.19.49,1.61,1.61,0,0,0,1.19-.49,1.63,1.63,0,0,0,.49-1.2Zm12.38,3.66a.28.28,0,0,0-.08-.2.29.29,0,0,0-.19-.08H9.19a.27.27,0,0,0-.28.28v1.69a.27.27,0,0,0,.08.19.24.24,0,0,0,.2.08H19.87a.27.27,0,0,0,.19-.08.25.25,0,0,0,.08-.19V10.79Zm0-4.5a.27.27,0,0,0-.08-.19A.25.25,0,0,0,19.88,6H9.19A.28.28,0,0,0,9,6.1a.26.26,0,0,0-.08.19V8A.27.27,0,0,0,9,8.17a.24.24,0,0,0,.2.08H19.87a.27.27,0,0,0,.19-.08A.25.25,0,0,0,20.14,8V6.29Z" transform="translate(-4.41 -5.44)"/></g></svg>',
        list_numbered: '<svg class="se-ci" viewBox="0 0 15.69 15.74"><g><path d="M7.66,18a1.24,1.24,0,0,0-.26-.78,1.17,1.17,0,0,0-.72-.42l.85-1V15H4.58v1.34h.94v-.46l.85,0h0c-.11.11-.22.23-.32.35s-.23.27-.37.47L5.39,17l.23.51c.61-.05.92.11.92.49a.42.42,0,0,1-.18.37.79.79,0,0,1-.45.12A1.41,1.41,0,0,1,5,18.15l-.51.77A2.06,2.06,0,0,0,6,19.5a1.8,1.8,0,0,0,1.2-.41A1.38,1.38,0,0,0,7.66,18Zm0-5.54H6.75V13H5.63A.72.72,0,0,1,6,12.51a5.45,5.45,0,0,1,.66-.45,2.71,2.71,0,0,0,.67-.57,1.19,1.19,0,0,0,.31-.81,1.29,1.29,0,0,0-.45-1,1.86,1.86,0,0,0-2-.11,1.51,1.51,0,0,0-.62.7l.74.52A.87.87,0,0,1,6,10.28a.51.51,0,0,1,.35.12.42.42,0,0,1,.13.33.55.55,0,0,1-.21.4,3,3,0,0,1-.5.38c-.19.13-.39.27-.58.42a2,2,0,0,0-.5.6,1.63,1.63,0,0,0-.21.81,3.89,3.89,0,0,0,.05.48h3.2V12.44Zm12.45,2.82a.27.27,0,0,0-.08-.19.28.28,0,0,0-.21-.08H9.1a.32.32,0,0,0-.21.08.24.24,0,0,0-.08.2V17a.27.27,0,0,0,.08.19.3.3,0,0,0,.21.08H19.83a.32.32,0,0,0,.21-.08.25.25,0,0,0,.08-.19V15.26ZM7.69,7.32h-1V3.76H5.8L4.6,4.88l.63.68a1.85,1.85,0,0,0,.43-.48h0l0,2.24H4.74V8.2h3V7.32Zm12.43,3.42a.27.27,0,0,0-.08-.19.28.28,0,0,0-.21-.08H9.1a.32.32,0,0,0-.21.08.24.24,0,0,0-.08.2v1.71a.27.27,0,0,0,.08.19.3.3,0,0,0,.21.08H19.83a.32.32,0,0,0,.21-.08.25.25,0,0,0,.08-.19V10.74Zm0-4.52A.27.27,0,0,0,20,6,.28.28,0,0,0,19.83,6H9.1A.32.32,0,0,0,8.89,6a.24.24,0,0,0-.08.19V7.93a.27.27,0,0,0,.08.19.32.32,0,0,0,.21.08H19.83A.32.32,0,0,0,20,8.12a.26.26,0,0,0,.08-.2V6.22Z" transform="translate(-4.43 -3.76)"/></g></svg>',
        blockquote: '<svg viewBox="0 0 24 24"><path d="M11 18V10H9.12L11.12 6H5.38L3 10.76V18M9 16H5V11.24L6.62 8H7.88L5.88 12H9M21 18V10H19.12L21.12 6H15.38L13 10.76V18M19 16H15V11.24L16.62 8H17.88L15.88 12H19Z" /></svg>',
        code_block: '<svg viewBox="0 0 24 24"><path d="M5.59 3.41L7 4.82L3.82 8L7 11.18L5.59 12.6L1 8L5.59 3.41M11.41 3.41L16 8L11.41 12.6L10 11.18L13.18 8L10 4.82L11.41 3.41M22 6V18C22 19.11 21.11 20 20 20H4C2.9 20 2 19.11 2 18V14H4V18H20V6H17.03V4H20C21.11 4 22 4.89 22 6Z" /></svg>',
        link: '<svg viewBox="0 0 24 24"><path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" /></svg>',
        unlink: '<svg viewBox="0 0 24 24"><path d="M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.43 19.12,14.63 17.79,15L19.25,16.44C20.88,15.61 22,13.95 22,12A5,5 0 0,0 17,7M16,11H13.81L15.81,13H16V11M2,4.27L5.11,7.38C3.29,8.12 2,9.91 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12C3.9,10.41 5.11,9.1 6.66,8.93L8.73,11H8V13H10.73L13,15.27V17H14.73L18.74,21L20,19.74L3.27,3L2,4.27Z" /></svg>',
        align_left: '<svg class="se-ci" viewBox="0 0 15.74 13.77"><g><path d="M4.41,4.74v2H20.15v-2H4.41Zm11.8,3.94H4.41v2H16.22v-2Zm-11.8,5.9H18.18v-2H4.41v2Zm0,3.93h9.84v-2H4.41v2Z" transform="translate(-4.41 -4.74)"/></g></svg>',
        align_center: '<svg class="se-ci" viewBox="0 0 15.74 13.77"><g><path d="M4.41,4.74v2H20.15v-2H4.41Zm2,3.94v2H18.18v-2H6.37Zm-1,5.9H19.16v-2H5.39v2Zm2,3.93H17.2v-2H7.36v2Z" transform="translate(-4.41 -4.74)"/></g></svg>',
        align_right: '<svg class="se-ci" viewBox="0 0 15.74 13.77"><g><path d="M4.41,4.74v2H20.15v-2H4.41Zm3.93,5.9H20.15v-2H8.34v2Zm-2,3.94H20.14v-2H6.37v2Zm3.94,3.93h9.84v-2H10.31v2Z" transform="translate(-4.41 -4.74)"/></g></svg>',
        align_justify: '<svg class="se-ci" viewBox="0 0 15.74 13.77"><g><path d="M4.41,4.74v2H20.15v-2H4.41Zm0,5.9H20.15v-2H4.41v2Zm0,3.94H20.15v-2H4.41v2Zm0,3.93h7.87v-2H4.41v2Z" transform="translate(-4.41 -4.74)"/></g></svg>',
        indent: '<svg viewBox="0 0 24 24"><path d="M11,13H21V11H11M11,9H21V7H11M3,3V5H21V3M11,17H21V15H11M3,8V16L7,12M3,21H21V19H3V21Z" /></svg>',
        outdent: '<svg viewBox="0 0 24 24"><path d="M11,13H21V11H11M11,9H21V7H11M3,3V5H21V3M3,21H21V19H3M3,12L7,16V8M11,17H21V15H11V17Z" /></svg>',
        horizontal_line: '<svg class="se-ci" viewBox="0 0 15.74 2.24"><g><path d="M20.15,12.75V10.51H4.41v2.24H20.15Z" transform="translate(-4.41 -10.51)"/></g></svg>',
        table: '<svg class="se-ci" viewBox="0 0 15.74 15.74"><g><path d="M4.41,8.05V3.76H8.7V8.05H4.41Zm5.71,0V3.76h4.3V8.05h-4.3Zm5.74-4.29h4.29V8.05H15.86V3.76Zm-11.45,10V9.48H8.7v4.3H4.41Zm5.71,0V9.48h4.3v4.3h-4.3Zm5.74,0V9.48h4.29v4.3H15.86ZM4.41,19.5V15.21H8.7V19.5H4.41Zm5.71,0V15.21h4.3V19.5h-4.3Zm5.74,0V15.21h4.29V19.5H15.86Z" transform="translate(-4.41 -3.76)"/></g></svg>',
        image: '<svg viewBox="0 0 24 24"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>',
        image_gallery: '<svg viewBox="0 0 24 24"><path d="M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z" /></svg>',
        undo: '<svg viewBox="0 0 24 24"><path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" /></svg>',
        redo: '<svg viewBox="0 0 24 24"><path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" /></svg>',
        remove_format: '<svg viewBox="0 0 24 24"><path d="M6,5V5.18L8.82,8H11.22L10.5,9.68L12.6,11.78L14.21,8H20V5H6M3.27,5L2,6.27L8.97,13.24L6.5,19H9.5L11.07,15.34L16.73,21L18,19.73L3.55,5.27L3.27,5Z" /></svg>',
        code_view: '<svg viewBox="0 0 24 24"><path d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z" /></svg>',
        table_properties: '<svg viewBox="0 0 24 24"><path d="M3.88 12L2.2 16.06L6.26 17.74L7.94 21.8L11 20.53V18.36L9 19.19L7.79 16.21L4.81 15L6.05 12L4.81 9L7.79 7.79L9 4.81L12 6.05L15 4.81L16.21 7.79L19.19 9L17.95 12L18 12.13L19.38 10.75C19.82 10.3 20.38 10.06 20.94 10L21.8 7.94L17.74 6.26L16.06 2.2L12 3.88L7.94 2.2L6.26 6.26L2.2 7.94L3.88 12M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96Z" /></svg>',
        insert_row_above: '<svg viewBox="0 0 24 24"><path d="M22,14A2,2 0 0,0 20,12H4A2,2 0 0,0 2,14V21H4V19H8V21H10V19H14V21H16V19H20V21H22V14M4,14H8V17H4V14M10,14H14V17H10V14M20,14V17H16V14H20M11,10H13V7H16V5H13V2H11V5H8V7H11V10Z" /></svg>',
        insert_row_below: '<svg viewBox="0 0 24 24"><path d="M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z" /></svg>',
        insert_column_left: '<svg viewBox="0 0 24 24"><path d="M13,2A2,2 0 0,0 11,4V20A2,2 0 0,0 13,22H22V2H13M20,10V14H13V10H20M20,16V20H13V16H20M20,4V8H13V4H20M9,11H6V8H4V11H1V13H4V16H6V13H9V11Z" /></svg>',
        insert_column_right: '<svg viewBox="0 0 24 24"><path d="M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z" /></svg>',
        delete_row: '<svg viewBox="0 0 24 24"><path d="M9.41,13L12,15.59L14.59,13L16,14.41L13.41,17L16,19.59L14.59,21L12,18.41L9.41,21L8,19.59L10.59,17L8,14.41L9.41,13M22,9A2,2 0 0,1 20,11H4A2,2 0 0,1 2,9V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V9M4,9H8V6H4V9M10,9H14V6H10V9M16,9H20V6H16V9Z" /></svg>',
        delete_column: '<svg viewBox="0 0 24 24"><path d="M4,2H11A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M17.59,12L15,9.41L16.41,8L19,10.59L21.59,8L23,9.41L20.41,12L23,14.59L21.59,16L19,13.41L16.41,16L15,14.59L17.59,12Z" /></svg>',
        delete: '<svg class="se-ci" viewBox="0 0 15.73 15.74"><g><path d="M19.16,6.71a.94.94,0,0,0,.69-.28.91.91,0,0,0,.29-.68A1,1,0,0,0,19.85,5a.93.93,0,0,0-.69-.3H14.24A.94.94,0,0,0,14,4.06a.92.92,0,0,0-.7-.3h-2a1,1,0,0,0-.7.3.93.93,0,0,0-.28.68H5.39A.92.92,0,0,0,4.7,5a1,1,0,0,0-.29.71.91.91,0,0,0,.29.68,1,1,0,0,0,.69.28H19.16Zm-12.79,1a1,1,0,0,0-.7.3.94.94,0,0,0-.28.69v8.85A1.88,1.88,0,0,0,6,18.93a1.9,1.9,0,0,0,1.39.57H17.2a1.87,1.87,0,0,0,1.39-.58,1.91,1.91,0,0,0,.58-1.39V8.68A1,1,0,0,0,18.88,8a.89.89,0,0,0-.7-.29,1,1,0,0,0-.69.29.92.92,0,0,0-.29.68v7.87a1,1,0,0,1-1,1H8.34a.94.94,0,0,1-.69-.28,1,1,0,0,1-.29-.71V8.68a1,1,0,0,0-1-1Z" transform="translate(-4.41 -3.76)"/></g></svg>'
    };

    /**
     * Toolbar button definitions
     * @type {Object}
     */
    static toolbarButtons = {
        bold: { icon: StarEditor.icons.bold, title: 'Bold (Ctrl+B)', command: 'bold' },
        italic: { icon: StarEditor.icons.italic, title: 'Italic (Ctrl+I)', command: 'italic' },
        underline: { icon: StarEditor.icons.underline, title: 'Underline (Ctrl+U)', command: 'underline' },
        strikethrough: { icon: StarEditor.icons.strike, title: 'Strikethrough', command: 'strikeThrough' },
        subscript: { icon: StarEditor.icons.subscript, title: 'Subscript', command: 'subscript', custom: true },
        superscript: { icon: StarEditor.icons.superscript, title: 'Superscript', command: 'superscript', custom: true },
        h1: { icon: 'H1', title: 'Heading 1', command: 'formatBlock', value: 'h1' },
        h2: { icon: 'H2', title: 'Heading 2', command: 'formatBlock', value: 'h2' },
        h3: { icon: 'H3', title: 'Heading 3', command: 'formatBlock', value: 'h3' },
        h4: { icon: 'H4', title: 'Heading 4', command: 'formatBlock', value: 'h4' },
        h5: { icon: 'H5', title: 'Heading 5', command: 'formatBlock', value: 'h5' },
        h6: { icon: 'H6', title: 'Heading 6', command: 'formatBlock', value: 'h6' },
        blockquote: { icon: StarEditor.icons.blockquote, title: 'Block Quote', command: 'formatBlock', value: 'blockquote' },
        pre: { icon: StarEditor.icons.code_block, title: 'Preformatted Block', command: 'formatBlock', value: 'pre' },
        ul: { icon: StarEditor.icons.list_bulleted, title: 'Bullet List', command: 'insertUnorderedList' },
        ol: { icon: StarEditor.icons.list_numbered, title: 'Numbered List', command: 'insertOrderedList' },
        hr: { icon: StarEditor.icons.horizontal_line, title: 'Horizontal Rule', command: 'insertHorizontalRule' },
        link: { icon: StarEditor.icons.link, title: 'Insert Link (Ctrl+K)', command: 'link', custom: true },
        unlink: { icon: StarEditor.icons.unlink, title: 'Remove Link', command: 'unlink' },
        alignLeft: { icon: StarEditor.icons.align_left, title: 'Align Left', command: 'justifyLeft' },
        alignCenter: { icon: StarEditor.icons.align_center, title: 'Align Center', command: 'justifyCenter' },
        alignRight: { icon: StarEditor.icons.align_right, title: 'Align Right', command: 'justifyRight' },
        justifyFull: { icon: StarEditor.icons.align_justify, title: 'Justify', command: 'justifyFull' },
        indent: { icon: StarEditor.icons.indent, title: 'Increase Indent', command: 'indent', custom: true },
        outdent: { icon: StarEditor.icons.outdent, title: 'Decrease Indent', command: 'outdent', custom: true },
        undo: { icon: StarEditor.icons.undo, title: 'Undo (Ctrl+Z)', command: 'undo' },
        redo: { icon: StarEditor.icons.redo, title: 'Redo (Ctrl+Y)', command: 'redo' },
        clearFormat: { icon: StarEditor.icons.remove_format, title: 'Clear Formatting', command: 'removeFormat', custom: true },
        fontSize: { icon: null, title: 'Font Size', command: 'fontSize', custom: true, type: 'dropdown' },
        fontName: { icon: null, title: 'Font Family', command: 'fontName', custom: true, type: 'dropdown' },
        textColor: { icon: StarEditor.icons.font_color, title: 'Text Color', command: 'foreColor', custom: true, type: 'colorPicker' },
        bgColor: { icon: StarEditor.icons.background_color, title: 'Background Color', command: 'backColor', custom: true, type: 'colorPicker' },
        table: { icon: StarEditor.icons.table, title: 'Insert Table', command: 'insertTable', custom: true },
        image: { icon: StarEditor.icons.image, title: 'Insert Image', command: 'insertImage', custom: true },
        gallery: { icon: StarEditor.icons.image_gallery, title: 'Insert gallery', command: 'insertGallery', custom: true },
        codeView: { icon: StarEditor.icons.code_view, title: 'View HTML Source', command: 'codeView', custom: true },
        heading: { icon: StarEditor.icons.text_style + StarEditor.icons.menu_arrow_down.replace('<svg ', '<svg class="star-caret" '), title: 'Heading', command: 'heading', custom: true, type: 'dropdown', groupItems: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
        alignment: { icon: StarEditor.icons.align_left + StarEditor.icons.menu_arrow_down.replace('<svg ', '<svg class="star-caret" '), title: 'Alignment', command: 'alignment', custom: true, type: 'dropdown', groupItems: ['alignLeft', 'alignCenter', 'alignRight', 'justifyFull'], activeIgnore: ['alignLeft'] },
        '|': { type: 'separator' }
    };

    /**
     * Embedded CSS styles
     * @type {string}
     */
    static styles = `
        .star-wrapper {
            border: 1px solid #ccc;
            border-radius: 4px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .star-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            padding: 8px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        .star-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
            min-width: 32px;
            height: 32px;
            padding: 4px 8px;
            border: 1px solid transparent;
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            transition: background-color 0.15s, border-color 0.15s;
        }
        .star-btn:hover {
            background: #e0e0e0;
            border-color: #ccc;
        }
        .star-btn:active {
            background: #d0d0d0;
        }
        .star-btn-active {
            background: #d0d0d0;
            border-color: #999;
        }
        .star-btn-disabled {
            opacity: 0.4;
            pointer-events: none;
        }
        .star-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            display: block;
            flex-shrink: 0;
        }
        .star-btn svg.se-ci {
            width: 14px;
            height: 14px;
        }
        .star-btn svg.star-caret {
            width: 8px;
            height: 8px;
            margin-left: 1px;
            flex-shrink: 0;
        }
        .star-btn .star-svg-color-bar {
            fill: #000;
        }
        .star-btn-label {
            font-size: 13px;
            max-width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .star-separator {
            display: inline-block;
            width: 1px;
            height: 24px;
            margin: 4px 6px;
            background: #ccc;
        }
        .star-editor {
            position: relative;
            padding: 12px;
            min-height: 200px;
            outline: none;
            overflow-y: auto;
            background: #fff;
            line-height: 1.6;
        }
        .star-editor:empty:before {
            content: attr(data-placeholder);
            color: #999;
            pointer-events: none;
        }
        .star-editor p {
            margin: 0 0 1em 0;
        }
        .star-editor p:last-child {
            margin-bottom: 0;
        }
        .star-editor h1, .star-editor h2, .star-editor h3 {
            margin: 0 0 0.5em 0;
            line-height: 1.3;
        }
        .star-editor h1 { font-size: 2em; }
        .star-editor h2 { font-size: 1.5em; }
        .star-editor h3 { font-size: 1.17em; }
        .star-editor ul, .star-editor ol {
            margin: 0 0 1em 0;
            padding-left: 2em;
        }
        .star-editor a {
            color: #0066cc;
            text-decoration: underline;
        }
        .star-editor a:hover {
            color: #004499;
        }
        .star-editor table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        .star-editor td, .star-editor th {
            border: 1px solid #ccc;
            padding: 8px;
            min-width: 40px;
        }
        .star-table-selected {
            outline: 2px solid #007bff;
            outline-offset: 2px;
        }
        .star-table-toolbar {
            position: absolute;
            z-index: 1000;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 4px;
            display: flex;
            gap: 2px;
            flex-wrap: wrap;
            max-width: 320px;
        }
        .star-table-toolbar-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
        }
        .star-table-toolbar-btn:hover {
            background: #e0e0e0;
        }
        .star-table-toolbar-btn svg {
            width: 15px;
            height: 15px;
            fill: currentColor;
            flex-shrink: 0;
        }
        .star-table-toolbar-btn svg.se-ci {
            width: 12px;
            height: 12px;
        }
        .star-table-toolbar-separator {
            width: 1px;
            background: #ddd;
            margin: 0 4px;
        }
        .star-editor img {
            max-width: 100%;
            height: auto;
        }
        .star-code-editor {
            width: 100%;
            min-height: 200px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            border: none;
            padding: 12px;
            resize: vertical;
            box-sizing: border-box;
            outline: none;
            background: #fff;
        }
        .star-dropdown-wrapper {
            position: relative;
            display: inline-block;
        }
        .star-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            min-width: 120px;
            max-height: 300px;
            overflow-y: auto;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: none;
        }
        .star-dropdown-open {
            display: block;
        }
        .star-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            cursor: pointer;
            white-space: nowrap;
        }
        .star-dropdown-item:hover {
            background: #f0f0f0;
        }
        .star-dropdown-item svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
            flex-shrink: 0;
        }
        .star-dropdown-item svg.se-ci {
            width: 13px;
            height: 13px;
        }
        .star-color-picker {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            padding: 8px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: none;
        }
        .star-color-picker-open {
            display: grid;
            grid-template-columns: repeat(6, 24px);
            gap: 4px;
        }
        .star-color-swatch {
            width: 24px;
            height: 24px;
            border: 1px solid #ccc;
            border-radius: 2px;
            cursor: pointer;
            box-sizing: border-box;
        }
        .star-color-swatch:hover {
            border-color: #333;
            transform: scale(1.1);
        }
        .star-color-remove {
            grid-column: span 6;
            text-align: center;
            padding: 4px;
            cursor: pointer;
            border-top: 1px solid #eee;
            margin-top: 4px;
            font-size: 12px;
            color: #666;
        }
        .star-color-remove:hover {
            background: #f0f0f0;
        }
        .star-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .star-modal {
            position: relative;
            z-index: 10001;
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            max-width: 90vw;
            max-height: 90vh;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .star-modal-header {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            flex-shrink: 0;
        }
        .star-modal-body {
            margin-bottom: 16px;
            flex: 1 1 auto;
            overflow-y: auto;
            min-height: 0;
        }
        .star-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            flex-shrink: 0;
        }
        .star-modal-row {
            margin-bottom: 12px;
        }
        .star-modal-label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 14px;
        }
        .star-modal-input {
            display: block;
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            position: relative;
            z-index: 1;
        }
        .star-modal-input:focus {
            outline: none;
            border-color: #007bff;
        }
        .star-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .star-modal-btn-primary {
            background: #007bff;
            color: #fff;
        }
        .star-modal-btn-primary:hover {
            background: #0056b3;
        }
        .star-modal-btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .star-modal-btn-secondary:hover {
            background: #d0d0d0;
        }
        .star-modal-tabs {
            display: flex;
            border-bottom: 1px solid #ccc;
            margin-bottom: 16px;
        }
        .star-modal-tab {
            padding: 8px 16px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }
        .star-modal-tab:hover {
            background: #f5f5f5;
        }
        .star-modal-tab-active {
            border-bottom-color: #007bff;
            color: #007bff;
        }
        .star-modal-tab-content {
            display: none;
        }
        .star-modal-tab-content-active {
            display: block;
        }
        .star-modal-wide {
            width: 80vw;
            max-width: 1100px;
        }
        .star-server-layout {
            display: flex;
            gap: 16px;
            min-height: 420px;
        }
        .star-server-sidebar {
            flex: 0 0 180px;
            border-right: 1px solid #eee;
            padding-right: 12px;
            overflow-y: auto;
            max-height: 460px;
        }
        .star-server-sidebar-label {
            font-weight: 600;
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .star-server-folder-tree {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .star-server-folder-tree li {
            padding: 4px 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .star-server-folder-tree li:hover { background: #f5f5f5; }
        .star-server-folder-active {
            background: #eef5ff;
            color: #007bff;
            font-weight: 600;
        }
        .star-server-main {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        .star-server-toolbar {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 10px;
        }
        .star-server-breadcrumb {
            flex: 1 1 auto;
            font-size: 13px;
            color: #555;
        }
        .star-server-breadcrumb span { cursor: pointer; }
        .star-server-breadcrumb span:hover { text-decoration: underline; }
        .star-server-search {
            flex: 0 0 220px;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
        }
        .star-server-grid-area {
            flex: 1 1 auto;
            min-height: 280px;
            overflow-y: auto;
        }
        .star-server-pager {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 10px;
            font-size: 13px;
        }
        .star-server-pager button {
            padding: 4px 10px;
            cursor: pointer;
        }
        .star-server-pager button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
        .star-server-images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 8px;
        }
        .star-server-image {
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            padding: 4px;
            text-align: center;
            overflow: hidden;
        }
        .star-server-image:hover {
            background: #f5f5f5;
        }
        .star-server-image-selected {
            border-color: #007bff;
            background: #eef5ff;
        }
        .star-server-image img {
            width: 100%;
            height: 80px;
            object-fit: contain;
            display: block;
        }
        .star-server-image-name {
            font-size: 12px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 4px;
        }
        .star-server-images-message {
            padding: 24px 12px;
            text-align: center;
            color: #666;
        }
        .star-server-images-message button {
            margin-left: 8px;
            padding: 4px 10px;
            cursor: pointer;
        }
        .star-image-selected {
            outline: 2px solid #007bff;
            outline-offset: 2px;
            cursor: pointer;
        }
        .star-image-toolbar {
            position: absolute;
            z-index: 1000;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 4px;
            display: flex;
            gap: 4px;
        }
        .star-image-toolbar-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            font-size: 12px;
        }
        .star-image-toolbar-btn:hover {
            background: #f0f0f0;
        }
        .star-image-toolbar-btn svg {
            width: 15px;
            height: 15px;
            fill: currentColor;
        }
        .star-image-toolbar-btn svg.se-ci {
            width: 12px;
            height: 12px;
        }
        .star-image-resizer {
            position: absolute;
            z-index: 999;
            border: 1px dashed #007bff;
            pointer-events: none;
        }
        .star-image-handle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #007bff;
            border: 1px solid #fff;
            pointer-events: all;
        }
        .star-image-handle-se {
            right: -5px;
            bottom: -5px;
            cursor: se-resize;
        }
        .star-image-handle-sw {
            left: -5px;
            bottom: -5px;
            cursor: sw-resize;
        }
        .star-image-handle-ne {
            right: -5px;
            top: -5px;
            cursor: ne-resize;
        }
        .star-image-handle-nw {
            left: -5px;
            top: -5px;
            cursor: nw-resize;
        }

        /* Gallery picker */
        .star-gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
        }
        @media (max-width: 576px) {
            .star-gallery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .star-gallery-card {
            border: 2px solid #dee2e6;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
            transition: border-color 0.15s, box-shadow 0.15s;
            background: #fff;
            outline: none;
        }
        .star-gallery-card:hover,
        .star-gallery-card:focus {
            border-color: #4b6bfb;
            box-shadow: 0 0 0 3px rgba(75, 107, 251, 0.15);
        }
        .star-gallery-card--selected {
            border-color: #d4a017;
            box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.25);
        }
        .star-gallery-card__thumb {
            aspect-ratio: 4 / 3;
            background: #f1f3f5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: #adb5bd;
            font-size: 1.5rem;
        }
        .star-gallery-card__thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .star-gallery-card__info {
            padding: 0.5rem 0.625rem;
        }
        .star-gallery-card__name {
            font-size: 0.8rem;
            font-weight: 600;
            color: #212529;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .star-gallery-card__count {
            font-size: 0.7rem;
            color: #6c757d;
            margin-top: 0.125rem;
        }
        .star-gallery-message {
            text-align: center;
            padding: 1.5rem 0;
            color: #6c757d;
            font-size: 0.875rem;
        }
        .star-gallery-message button {
            display: block;
            margin: 0.5rem auto 0;
        }
        .star-gallery-pager {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 0.75rem;
            font-size: 0.8rem;
        }
    `;

    /**
     * Original textarea element
     * @type {HTMLTextAreaElement}
     */
    textarea;

    /**
     * Merged configuration
     * @type {Object}
     */
    config;

    /**
     * Wrapper container element
     * @type {HTMLDivElement}
     */
    wrapper;

    /**
     * Toolbar element
     * @type {HTMLDivElement}
     */
    toolbar;

    /**
     * Contenteditable editor element
     * @type {HTMLDivElement}
     */
    editor;

    /**
     * Code view textarea element
     * @type {HTMLTextAreaElement}
     */
    codeEditor;

    /**
     * Whether editor is in code view mode
     * @type {boolean}
     */
    isCodeView = false;

    /**
     * Saved selection range for restoring after popup interactions
     * @type {Range|null}
     */
    savedSelection = null;

    /**
     * Document click handler reference for cleanup
     * @type {Function|null}
     */
    documentClickHandler = null;

    /**
     * Currently selected image element
     * @type {HTMLImageElement|null}
     */
    selectedImage = null;

    /**
     * Image toolbar element
     * @type {HTMLElement|null}
     */
    imageToolbar = null;

    /**
     * Image resizer overlay element
     * @type {HTMLElement|null}
     */
    imageResizer = null;

    /**
     * Create a new StarEditor instance
     *
     * @param {HTMLTextAreaElement|string} textarea - Textarea element or selector
     * @param {Object} options - Configuration options
     */
    constructor(textarea, options = {}) {
        if (typeof textarea === 'string') {
            textarea = document.querySelector(textarea);
        }

        if (!textarea || textarea.tagName !== 'TEXTAREA') {
            throw new Error('StarEditor requires a textarea element');
        }

        this.textarea = textarea;
        this.config = { ...StarEditor.defaults, ...options };

        // The toolbar is no longer host-configurable (removed in v3.0.0) — it is always
        // rendered in full via the fixed static toolbarLayout. Warn once if a host still
        // passes the removed option, then drop it so no stale key survives on this.config.
        if ('toolbar' in options) {
            if (!StarEditor.toolbarOptionWarned) {
                console.warn('StarEditor: the `toolbar` option was removed in v3.0.0 — the toolbar is always shown in full and can no longer be customized.');
                StarEditor.toolbarOptionWarned = true;
            }
            delete this.config.toolbar;
        }

        // Resolve locale: 'auto' detects from browser, defaults to 'en'
        if (this.config.locale === 'auto') {
            const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            this.config.locale = browserLang.startsWith('hu') ? 'hu' : 'en';
        }

        this.init();
    }

    /**
     * Get a translated string by key
     *
     * Falls back to English if the key is not found in the active locale.
     *
     * @param {string} key - Translation key (e.g. 'toolbar.bold')
     * @returns {string} Translated string
     */
    t(key) {
        const locale = this.config.locale;
        const translations = StarEditor.translations;

        if (translations[locale] && translations[locale][key] !== undefined) {
            return translations[locale][key];
        }

        return translations.en[key] || key;
    }

    /**
     * Initialize the editor
     * @private
     */
    init() {
        StarEditor.injectStyles(this.config.classPrefix);
        this.buildWrapper();
        this.buildToolbar();
        this.buildEditor();
        this.buildCodeEditor();
        this.bindEvents();

        // Set initial content from textarea (sanitize any embedded editor UI)
        if (this.textarea.value) {
            this.editor.innerHTML = this.sanitizeEditorUI(this.textarea.value);
        }

        // Font size / font family triggers need a real value as soon as the editor
        // exists — buildToolbar() ran before this.editor was created and couldn't show one.
        this.updateToolbarState();
    }

    /**
     * Inject CSS styles into the document
     * @param {string} prefix - CSS class prefix
     * @private
     */
    static injectStyles(prefix = 'star') {
        if (StarEditor.stylesInjected) return;

        const style = document.createElement('style');
        style.id = 'star-editor-styles';
        style.textContent = StarEditor.styles.replace(/\.star-/g, `.${prefix}-`);
        document.head.appendChild(style);
        StarEditor.stylesInjected = true;
    }

    /**
     * Build the wrapper container
     * @private
     */
    buildWrapper() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = `${this.config.classPrefix}-wrapper`;

        // Insert wrapper before textarea and hide textarea
        this.textarea.parentNode.insertBefore(this.wrapper, this.textarea);
        this.textarea.style.display = 'none';
    }

    /**
     * Build the toolbar
     * @private
     */
    buildToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = `${this.config.classPrefix}-toolbar`;

        StarEditor.toolbarLayout.forEach(item => {
            // The gallery button requires a configured gallery source — without it, the
            // picker modal has nothing to show, so skip it (feature flag, not toolbar composition).
            if (item === 'gallery' && !this.config.serverGalleries) return;

            const def = StarEditor.toolbarButtons[item];
            if (!def) return;

            if (item === '|' || def.type === 'separator') {
                const sep = document.createElement('span');
                sep.className = `${this.config.classPrefix}-separator`;
                this.toolbar.appendChild(sep);
                return;
            }

            // Handle dropdown type buttons
            if (def.type === 'dropdown') {
                const wrapper = this.createDropdownButton(item, def);
                this.toolbar.appendChild(wrapper);
                return;
            }

            // Handle color picker type buttons
            if (def.type === 'colorPicker') {
                const wrapper = this.createColorPickerButton(item, def);
                this.toolbar.appendChild(wrapper);
                return;
            }

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `${this.config.classPrefix}-btn`;
            btn.dataset.command = def.command;
            if (def.value) btn.dataset.value = def.value;
            if (def.custom) btn.dataset.custom = 'true';
            btn.title = this.t('toolbar.' + item) || def.title;
            btn.innerHTML = def.icon;

            this.toolbar.appendChild(btn);
        });

        this.wrapper.appendChild(this.toolbar);
    }

    /**
     * Build the contenteditable editor area
     * @private
     */
    buildEditor() {
        this.editor = document.createElement('div');
        this.editor.className = `${this.config.classPrefix}-editor`;
        this.editor.contentEditable = 'true';

        // Use <p> tags for paragraphs instead of <div>
        document.execCommand('defaultParagraphSeparator', false, 'p');

        if (this.config.placeholder) {
            this.editor.dataset.placeholder = this.config.placeholder;
        }

        if (this.config.minHeight) {
            this.editor.style.minHeight = this.config.minHeight;
        }

        if (this.config.maxHeight) {
            this.editor.style.maxHeight = this.config.maxHeight;
        }

        this.wrapper.appendChild(this.editor);
    }

    /**
     * Build the code editor textarea for HTML source editing
     * @private
     */
    buildCodeEditor() {
        this.codeEditor = document.createElement('textarea');
        this.codeEditor.className = `${this.config.classPrefix}-code-editor`;
        this.codeEditor.style.display = 'none';

        if (this.config.minHeight) {
            this.codeEditor.style.minHeight = this.config.minHeight;
        }

        if (this.config.maxHeight) {
            this.codeEditor.style.maxHeight = this.config.maxHeight;
        }

        this.wrapper.appendChild(this.codeEditor);
    }

    /**
     * Create a dropdown button with menu
     *
     * @param {string} name - Button name (e.g., 'fontSize', 'fontName')
     * @param {Object} def - Button definition
     * @returns {HTMLElement} Wrapper element containing button and dropdown
     * @private
     */
    createDropdownButton(name, def) {
        const prefix = this.config.classPrefix;
        const wrapper = document.createElement('div');
        wrapper.className = `${prefix}-dropdown-wrapper`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `${prefix}-btn`;
        btn.dataset.command = def.command;
        btn.dataset.custom = 'true';
        btn.dataset.dropdownTrigger = name;
        btn.title = this.t('toolbar.' + name) || def.title;

        if (name === 'fontSize' || name === 'fontName') {
            // These two triggers show the current value instead of a fixed icon.
            btn.innerHTML = `<span class="${prefix}-btn-label"></span>` + StarEditor.icons.menu_arrow_down;
            this.updateFontTriggerLabel(btn, name);
        } else {
            btn.innerHTML = def.icon;
        }

        const dropdown = document.createElement('div');
        dropdown.className = `${prefix}-dropdown`;
        dropdown.dataset.dropdown = name;

        // Populate dropdown items based on button type
        if (def.groupItems) {
            def.groupItems.forEach(key => {
                const itemDef = StarEditor.toolbarButtons[key];
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = key;
                item.title = this.t('toolbar.' + key) || itemDef.title;
                item.innerHTML = itemDef.icon;
                dropdown.appendChild(item);
            });
        } else if (name === 'fontSize') {
            this.config.fontSizes.forEach(size => {
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = size;
                item.textContent = size;
                item.style.fontSize = size;
                dropdown.appendChild(item);
            });
        } else if (name === 'fontName') {
            this.config.fontFamilies.forEach(font => {
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = font.value;
                item.textContent = font.label;
                item.style.fontFamily = font.value;
                dropdown.appendChild(item);
            });
        }

        wrapper.appendChild(btn);
        wrapper.appendChild(dropdown);

        return wrapper;
    }

    /**
     * Create a color picker button with palette
     *
     * @param {string} name - Button name (e.g., 'textColor', 'bgColor')
     * @param {Object} def - Button definition
     * @returns {HTMLElement} Wrapper element containing button and color picker
     * @private
     */
    createColorPickerButton(name, def) {
        const prefix = this.config.classPrefix;
        const wrapper = document.createElement('div');
        wrapper.className = `${prefix}-dropdown-wrapper`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `${prefix}-btn`;
        btn.dataset.command = def.command;
        btn.dataset.custom = 'true';
        btn.dataset.colorPickerTrigger = name;
        btn.title = this.t('toolbar.' + name) || def.title;
        btn.innerHTML = def.icon;

        // Default color bar: black for text color, yellow for background color —
        // mirrors the pre-SVG icons' default hint before any color has been picked.
        const bar = btn.querySelector('.star-svg-color-bar');
        if (bar && name === 'bgColor') {
            bar.style.fill = '#ffff00';
        }

        const picker = document.createElement('div');
        picker.className = `${prefix}-color-picker`;
        picker.dataset.colorPicker = name;

        // Add color swatches
        this.config.colorPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = `${prefix}-color-swatch`;
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            swatch.title = color;
            picker.appendChild(swatch);
        });

        // Add remove color option for background color
        if (name === 'bgColor') {
            const remove = document.createElement('div');
            remove.className = `${prefix}-color-remove`;
            remove.dataset.color = 'transparent';
            remove.textContent = this.t('colorPicker.remove');
            picker.appendChild(remove);
        }

        wrapper.appendChild(btn);
        wrapper.appendChild(picker);

        return wrapper;
    }

    /**
     * Bind event listeners
     * @private
     */
    bindEvents() {
        const prefix = this.config.classPrefix;

        // Toolbar button clicks via event delegation
        this.toolbar.addEventListener('click', (e) => {
            // Handle dropdown trigger clicks
            const dropdownTrigger = e.target.closest('[data-dropdown-trigger]');
            if (dropdownTrigger) {
                e.preventDefault();
                e.stopPropagation();
                this.saveSelection();
                this.toggleDropdown(dropdownTrigger.dataset.dropdownTrigger);
                return;
            }

            // Handle dropdown item clicks
            const dropdownItem = e.target.closest(`.${prefix}-dropdown-item`);
            if (dropdownItem) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = dropdownItem.closest(`.${prefix}-dropdown`);
                const name = dropdown.dataset.dropdown;
                const value = dropdownItem.dataset.value;
                this.handleDropdownSelect(name, value);
                return;
            }

            // Handle color picker trigger clicks
            const colorTrigger = e.target.closest('[data-color-picker-trigger]');
            if (colorTrigger) {
                e.preventDefault();
                e.stopPropagation();
                this.saveSelection();
                this.toggleColorPicker(colorTrigger.dataset.colorPickerTrigger);
                return;
            }

            // Handle color swatch clicks
            const colorSwatch = e.target.closest(`.${prefix}-color-swatch, .${prefix}-color-remove`);
            if (colorSwatch) {
                e.preventDefault();
                e.stopPropagation();
                const picker = colorSwatch.closest(`.${prefix}-color-picker`);
                const name = picker.dataset.colorPicker;
                const color = colorSwatch.dataset.color;
                this.handleColorSelect(name, color);
                return;
            }

            // Handle regular button clicks
            const btn = e.target.closest('[data-command]');
            if (!btn) return;

            e.preventDefault();

            if (btn.dataset.custom === 'true') {
                this.handleCustomCommand(btn.dataset.command);
            } else {
                this.exec(btn.dataset.command, btn.dataset.value || null);
            }
        });

        // Content sync on input — shared by both the WYSIWYG editor and the
        // code view textarea, so an edit made in either mode is immediately
        // reflected in the hidden textarea and in onChange.
        const handleContentInput = () => {
            this.sync();
            if (this.config.onChange) {
                this.config.onChange(this.getContent());
            }
        };
        this.editor.addEventListener('input', handleContentInput);
        this.codeEditor.addEventListener('input', handleContentInput);

        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Paste handling
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));

        // Focus/blur callbacks
        this.editor.addEventListener('focus', () => {
            if (this.config.onFocus) {
                this.config.onFocus();
            }
        });

        this.editor.addEventListener('blur', () => {
            if (this.config.onBlur) {
                this.config.onBlur();
            }
        });

        // Update toolbar state on selection change
        document.addEventListener('selectionchange', () => {
            if (this.editor.contains(document.getSelection().anchorNode)) {
                this.updateToolbarState();
            }
        });

        // Image click handler for editing
        this.editor.addEventListener('click', (e) => {
            const prefix = this.config.classPrefix;

            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                this.selectImage(e.target);
                this.deselectTable();
            } else if (e.target.closest('table')) {
                const table = e.target.closest('table');
                const cell = e.target.closest('td, th');
                if (!e.target.closest(`.${prefix}-table-toolbar`)) {
                    this.selectTable(table, cell);
                    this.deselectImage();
                }
            } else {
                if (!e.target.closest(`.${prefix}-image-toolbar`)) {
                    this.deselectImage();
                }
                if (!e.target.closest(`.${prefix}-table-toolbar`)) {
                    this.deselectTable();
                }
            }
        });

        // Document click handler to close popups and deselect images/tables
        this.documentClickHandler = (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.closeAllPopups();
                this.deselectImage();
                this.deselectTable();
            }
        };
        document.addEventListener('click', this.documentClickHandler);

        // Sync before form submission
        const form = this.textarea.closest('form');
        if (form) {
            form.addEventListener('submit', () => this.sync());
        }
    }

    /**
     * Execute a formatting command
     *
     * @param {string} command - The execCommand command name
     * @param {string|null} value - Optional value for the command
     */
    exec(command, value = null) {
        this.editor.focus();

        if (command === 'formatBlock' && value) {
            // Toggle off: if already in the requested block type, revert to <p>
            const currentBlock = document.queryCommandValue('formatBlock');
            if (currentBlock.toLowerCase() === value.toLowerCase()) {
                document.execCommand(command, false, '<p>');
            } else {
                document.execCommand(command, false, `<${value}>`);
            }
        } else {
            document.execCommand(command, false, value);
        }

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Handle custom commands (like link insertion)
     *
     * @param {string} command - The custom command name
     * @private
     */
    handleCustomCommand(command) {
        switch (command) {
            case 'link':
                this.insertLink();
                break;
            case 'codeView':
                this.toggleCodeView();
                break;
            case 'insertTable':
                this.showTableModal();
                break;
            case 'insertImage':
                this.showImageModal();
                break;
            case 'insertGallery':
                this.showGalleryModal();
                break;
            case 'subscript':
                this.toggleSubscript();
                break;
            case 'superscript':
                this.toggleSuperscript();
                break;
            case 'indent':
                this.applyIndent();
                break;
            case 'outdent':
                this.applyOutdent();
                break;
            case 'removeFormat':
                this.safeRemoveFormat();
                break;
        }
    }

    /**
     * Toggle subscript, removing superscript first to avoid conflicts
     * @private
     */
    toggleSubscript() {
        this.editor.focus();

        // Remove superscript first if active
        if (this.isInsideTag('sup')) {
            document.execCommand('superscript', false, null);
        }

        document.execCommand('subscript', false, null);
        this.sync();
        this.updateToolbarState();
    }

    /**
     * Toggle superscript, removing subscript first to avoid conflicts
     * @private
     */
    toggleSuperscript() {
        this.editor.focus();

        // Remove subscript first if active
        if (this.isInsideTag('sub')) {
            document.execCommand('subscript', false, null);
        }

        document.execCommand('superscript', false, null);
        this.sync();
        this.updateToolbarState();
    }

    /**
     * Check if current selection is inside a specific HTML tag
     *
     * @param {string} tagName - Tag name to check (lowercase)
     * @returns {boolean} True if selection is inside the tag
     * @private
     */
    isInsideTag(tagName) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return false;

        let node = sel.anchorNode;
        while (node && node !== this.editor) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === tagName) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * Get the closest block-level parent element of the current selection
     *
     * @returns {HTMLElement|null} The closest block element or null
     * @private
     */
    getSelectedBlockElement() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;

        let node = sel.anchorNode;
        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentElement;
        }

        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            'BLOCKQUOTE', 'PRE', 'LI', 'TD', 'TH'];

        while (node && node !== this.editor) {
            if (node.nodeType === Node.ELEMENT_NODE && blockTags.includes(node.tagName)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    /**
     * Increase indentation using consistent margin-left CSS across all browsers
     * @private
     */
    applyIndent() {
        this.editor.focus();
        const block = this.getSelectedBlockElement();
        if (!block) return;

        const currentMargin = parseInt(getComputedStyle(block).marginLeft, 10) || 0;
        block.style.marginLeft = (currentMargin + 40) + 'px';

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Decrease indentation using consistent margin-left CSS across all browsers
     * @private
     */
    applyOutdent() {
        this.editor.focus();
        const block = this.getSelectedBlockElement();
        if (!block) return;

        const currentMargin = parseInt(getComputedStyle(block).marginLeft, 10) || 0;
        const newMargin = Math.max(0, currentMargin - 40);

        if (newMargin === 0) {
            block.style.marginLeft = '';
            // Clean up empty style attribute
            if (!block.getAttribute('style')?.trim()) {
                block.removeAttribute('style');
            }
        } else {
            block.style.marginLeft = newMargin + 'px';
        }

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Remove formatting while preserving links (Safari compatibility)
     *
     * Safari's native removeFormat also removes anchor elements.
     * This method saves links, removes formatting, then restores them.
     * @private
     */
    safeRemoveFormat() {
        this.editor.focus();
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const scope = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

        // Collect all links within the selection range
        const links = [];
        const allAnchors = scope.querySelectorAll ? scope.querySelectorAll('a[href]') : [];
        allAnchors.forEach(a => {
            if (range.intersectsNode(a)) {
                links.push({
                    href: a.href,
                    target: a.target,
                    textContent: a.textContent
                });
            }
        });

        // Execute removeFormat
        document.execCommand('removeFormat', false, null);

        // Restore links that were removed by Safari
        if (links.length > 0) {
            const updatedContent = this.editor.innerHTML;
            links.forEach(link => {
                // Check if the link text still exists but is no longer wrapped in <a>
                const escapedText = link.textContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const linkExists = this.editor.querySelector(`a[href="${CSS.escape(link.href)}"]`);
                if (!linkExists) {
                    // Find the text node and re-wrap it
                    const treeWalker = document.createTreeWalker(
                        this.editor, NodeFilter.SHOW_TEXT, null
                    );
                    while (treeWalker.nextNode()) {
                        const textNode = treeWalker.currentNode;
                        if (textNode.textContent.includes(link.textContent)) {
                            const newAnchor = document.createElement('a');
                            newAnchor.href = link.href;
                            if (link.target) newAnchor.target = link.target;
                            newAnchor.textContent = link.textContent;
                            textNode.parentNode.replaceChild(newAnchor, textNode);
                            break;
                        }
                    }
                }
            });
        }

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Insert a link at the current selection
     */
    insertLink() {
        const selection = window.getSelection();
        const hasSelection = selection.toString().length > 0;

        const url = prompt(this.t('prompt.enterUrl'), 'https://');

        if (!url || url === 'https://') return;

        this.editor.focus();

        if (hasSelection) {
            document.execCommand('createLink', false, url);

            // Add target="_blank" if configured
            if (this.config.linkTargetBlank) {
                const links = this.editor.querySelectorAll(`a[href="${url}"]`);
                links.forEach(link => {
                    if (!link.target) {
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                    }
                });
            }
        } else {
            // No selection - insert link with URL as text
            const linkHtml = this.config.linkTargetBlank
                ? `<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(url)}</a>`
                : `<a href="${this.escapeHtml(url)}">${this.escapeHtml(url)}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
        }

        this.sync();
    }

    /**
     * Save the current selection for later restoration
     * @private
     */
    saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            this.savedSelection = selection.getRangeAt(0).cloneRange();
        }
    }

    /**
     * Restore the previously saved selection
     * @private
     */
    restoreSelection() {
        if (this.savedSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.savedSelection);
        }
        this.editor.focus();
    }

    /**
     * Toggle a dropdown menu
     *
     * @param {string} name - The dropdown name
     * @private
     */
    toggleDropdown(name) {
        const prefix = this.config.classPrefix;
        const dropdown = this.toolbar.querySelector(`[data-dropdown="${name}"]`);

        if (!dropdown) return;

        const isOpen = dropdown.classList.contains(`${prefix}-dropdown-open`);

        // Close all popups first
        this.closeAllPopups();

        if (!isOpen) {
            dropdown.classList.add(`${prefix}-dropdown-open`);
        }
    }

    /**
     * Toggle a color picker
     *
     * @param {string} name - The color picker name
     * @private
     */
    toggleColorPicker(name) {
        const prefix = this.config.classPrefix;
        const picker = this.toolbar.querySelector(`[data-color-picker="${name}"]`);

        if (!picker) return;

        const isOpen = picker.classList.contains(`${prefix}-color-picker-open`);

        // Close all popups first
        this.closeAllPopups();

        if (!isOpen) {
            picker.classList.add(`${prefix}-color-picker-open`);
        }
    }

    /**
     * Handle dropdown item selection
     *
     * @param {string} name - The dropdown name
     * @param {string} value - The selected value
     * @private
     */
    handleDropdownSelect(name, value) {
        this.closeAllPopups();
        this.restoreSelection();

        const def = StarEditor.toolbarButtons[name];

        if (name === 'fontSize') {
            this.applyFontSize(value);
        } else if (name === 'fontName') {
            document.execCommand('fontName', false, value);
        } else if (def && def.groupItems) {
            const itemDef = StarEditor.toolbarButtons[value];
            if (itemDef.custom) {
                this.handleCustomCommand(itemDef.command);
            } else {
                this.exec(itemDef.command, itemDef.value || null);
            }
        }

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Apply font size using inline style span
     *
     * @param {string} size - The font size value (e.g., '16px')
     * @private
     */
    applyFontSize(size) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        if (range.collapsed) {
            // No selection - insert a zero-width space in a styled span
            const span = document.createElement('span');
            span.style.fontSize = size;
            span.innerHTML = '&#8203;'; // Zero-width space
            range.insertNode(span);

            // Place cursor inside the span
            range.setStart(span.firstChild, 1);
            range.setEnd(span.firstChild, 1);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // Has selection - wrap in styled span
            const span = document.createElement('span');
            span.style.fontSize = size;

            try {
                range.surroundContents(span);
            } catch (e) {
                // If surroundContents fails (e.g., partial element selection),
                // use execCommand with insertHTML
                const contents = range.extractContents();
                span.appendChild(contents);
                range.insertNode(span);
            }

            // Select the new span contents
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * Handle color selection
     *
     * @param {string} name - The color picker name ('textColor' or 'bgColor')
     * @param {string} color - The selected color
     * @private
     */
    handleColorSelect(name, color) {
        this.closeAllPopups();
        this.restoreSelection();

        if (name === 'textColor') {
            document.execCommand('foreColor', false, color);
        } else if (name === 'bgColor') {
            if (color === 'transparent') {
                document.execCommand('removeFormat', false, null);
            } else {
                document.execCommand('backColor', false, color);
            }
        }

        // Reflect the picked color on the button's icon, same as SunEditor's own color buttons
        const trigger = this.toolbar.querySelector(`[data-color-picker-trigger="${name}"]`);
        const bar = trigger && trigger.querySelector('.star-svg-color-bar');
        if (bar) {
            bar.style.fill = color === 'transparent' ? '#ffff00' : color;
        }

        this.sync();
        this.updateToolbarState();
    }

    /**
     * Close all open dropdowns and color pickers
     * @private
     */
    closeAllPopups() {
        const prefix = this.config.classPrefix;
        this.toolbar.querySelectorAll(`.${prefix}-dropdown-open`).forEach(el => {
            el.classList.remove(`${prefix}-dropdown-open`);
        });
        this.toolbar.querySelectorAll(`.${prefix}-color-picker-open`).forEach(el => {
            el.classList.remove(`${prefix}-color-picker-open`);
        });
    }

    /**
     * Toggle between WYSIWYG and code view modes
     */
    toggleCodeView() {
        const prefix = this.config.classPrefix;
        this.isCodeView = !this.isCodeView;

        if (this.isCodeView) {
            // Deselect any selected elements before switching
            this.deselectImage();
            this.deselectTable();

            // Switch to code view - use clean content without UI elements
            this.codeEditor.value = this.getCleanContent();
            this.editor.style.display = 'none';
            this.codeEditor.style.display = 'block';
            this.codeEditor.focus();

            // Disable all toolbar buttons except codeView
            this.toolbar.querySelectorAll(`.${prefix}-btn`).forEach(btn => {
                if (btn.dataset.command !== 'codeView') {
                    btn.classList.add(`${prefix}-btn-disabled`);
                } else {
                    btn.classList.add(`${prefix}-btn-active`);
                }
            });
        } else {
            // Switch back to WYSIWYG view (sanitize any embedded editor UI)
            this.editor.innerHTML = this.sanitizeEditorUI(this.codeEditor.value);
            this.codeEditor.style.display = 'none';
            this.editor.style.display = 'block';
            this.editor.focus();
            this.sync();

            // Enable all toolbar buttons
            this.toolbar.querySelectorAll(`.${prefix}-btn`).forEach(btn => {
                btn.classList.remove(`${prefix}-btn-disabled`);
                if (btn.dataset.command === 'codeView') {
                    btn.classList.remove(`${prefix}-btn-active`);
                }
            });
        }
    }

    /**
     * Show the table insertion modal
     */
    showTableModal() {
        const prefix = this.config.classPrefix;
        const defaults = this.config.tableDefaults;

        this.saveSelection();

        const content = `
            <div class="${prefix}-modal-header">${this.t('modal.insertTable')}</div>
            <div class="${prefix}-modal-body">
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.rows')}</label>
                    <input type="number" class="${prefix}-modal-input" id="${prefix}-table-rows" value="${defaults.rows}" min="1" max="20">
                </div>
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.columns')}</label>
                    <input type="number" class="${prefix}-modal-input" id="${prefix}-table-cols" value="${defaults.cols}" min="1" max="20">
                </div>
            </div>
            <div class="${prefix}-modal-footer">
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-secondary" data-action="cancel">${this.t('modal.cancel')}</button>
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-primary" data-action="insert">${this.t('modal.insert')}</button>
            </div>
        `;

        this.showModal(content, (modal) => {
            const rows = parseInt(modal.querySelector(`#${prefix}-table-rows`).value, 10) || defaults.rows;
            const cols = parseInt(modal.querySelector(`#${prefix}-table-cols`).value, 10) || defaults.cols;
            this.insertTable(rows, cols);
        });
    }

    /**
     * Insert a table with the specified dimensions
     *
     * @param {number} rows - Number of rows
     * @param {number} cols - Number of columns
     */
    insertTable(rows, cols) {
        let html = '<table><tbody>';

        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                html += '<td>&nbsp;</td>';
            }
            html += '</tr>';
        }

        html += '</tbody></table>';

        this.restoreSelection();
        document.execCommand('insertHTML', false, html);
        this.sync();
    }

    /**
     * Show the image insertion modal
     */
    showImageModal() {
        const prefix = this.config.classPrefix;

        this.saveSelection();

        let content = `
            <div class="${prefix}-modal-header">${this.t('modal.insertImage')}</div>
            <div class="${prefix}-modal-body">
        `;

        const defaultTab = this.config.serverImages != null ? 'server'
            : (this.config.imageUpload ? 'upload' : 'url');

        const tabActive = (tab) => tab === defaultTab ? ` ${prefix}-modal-tab-active` : '';
        const contentActive = (tab) => tab === defaultTab ? ` ${prefix}-modal-tab-content-active` : '';

        content += `
            <div class="${prefix}-modal-tabs">
                <div class="${prefix}-modal-tab${tabActive('server')}" data-tab="server">${this.t('modal.tabServer')}</div>
                ${this.config.imageUpload ? `<div class="${prefix}-modal-tab${tabActive('upload')}" data-tab="upload">${this.t('modal.tabUpload')}</div>` : ''}
                <div class="${prefix}-modal-tab${tabActive('url')}" data-tab="url">${this.t('modal.tabUrl')}</div>
            </div>
            <div class="${prefix}-modal-tab-content${contentActive('server')}" data-tab-content="server">
                <div class="${prefix}-server-layout">
                    <aside class="${prefix}-server-sidebar">
                        <div class="${prefix}-server-sidebar-label">${this.t('modal.serverFolders')}</div>
                        <ul class="${prefix}-server-folder-tree"></ul>
                    </aside>
                    <div class="${prefix}-server-main">
                        <div class="${prefix}-server-toolbar">
                            <div class="${prefix}-server-breadcrumb"></div>
                            <input type="search" class="${prefix}-server-search" placeholder="${this.t('modal.serverSearch')}">
                        </div>
                        <div class="${prefix}-server-grid-area">
                            <div class="${prefix}-server-images-message">${this.t('modal.serverLoading')}</div>
                        </div>
                        <div class="${prefix}-server-pager"></div>
                    </div>
                </div>
            </div>
            ${this.config.imageUpload ? `
            <div class="${prefix}-modal-tab-content${contentActive('upload')}" data-tab-content="upload">
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.selectImage')}</label>
                    <input type="file" class="${prefix}-modal-input" id="${prefix}-image-file" accept="${this.config.allowedImageTypes.join(',')}">
                </div>
            </div>` : ''}
            <div class="${prefix}-modal-tab-content${contentActive('url')}" data-tab-content="url">
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.imageUrl')}</label>
                    <input type="url" class="${prefix}-modal-input" id="${prefix}-image-url" placeholder="https://example.com/image.jpg">
                </div>
            </div>
        `;

        content += `
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.altText')}</label>
                    <input type="text" class="${prefix}-modal-input" id="${prefix}-image-alt" placeholder="${this.t('modal.altPlaceholder')}">
                </div>
            </div>
            <div class="${prefix}-modal-footer">
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-secondary" data-action="cancel">${this.t('modal.cancel')}</button>
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-primary" data-action="insert">${this.t('modal.insert')}</button>
            </div>
        `;

        const modalOptions = this.config.serverImages != null
            ? { modalClass: `${prefix}-modal-wide` }
            : {};

        this.showModal(content, (modal) => {
            const activeTab = modal.querySelector(`.${prefix}-modal-tab-active`);
            const activeTabName = activeTab ? activeTab.dataset.tab : 'url';
            const alt = modal.querySelector(`#${prefix}-image-alt`).value || '';

            if (activeTabName === 'server') {
                const state = modal._serverState;
                if (state && state.selectedUrl) {
                    this._insertImage(state.selectedUrl, alt, 'server', state.selectedItem);
                }
            } else if (activeTabName === 'upload') {
                const file = modal.querySelector(`#${prefix}-image-file`);
                if (file && file.files.length > 0) {
                    this.insertImageFromFile(file.files[0], alt);
                }
            } else {
                const url = modal.querySelector(`#${prefix}-image-url`);
                if (url && url.value) {
                    this._insertImage(url.value, alt, 'url', null);
                }
            }
        }, (modal) => {
            const tabs = modal.querySelectorAll(`.${prefix}-modal-tab`);
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    tabs.forEach(t => t.classList.remove(`${prefix}-modal-tab-active`));
                    tab.classList.add(`${prefix}-modal-tab-active`);

                    const tabName = tab.dataset.tab;
                    modal.querySelectorAll(`.${prefix}-modal-tab-content`).forEach(c => {
                        c.classList.remove(`${prefix}-modal-tab-content-active`);
                    });
                    modal.querySelector(`[data-tab-content="${tabName}"]`).classList.add(`${prefix}-modal-tab-content-active`);

                    if (tabName === 'server') {
                        this.loadServerTab(modal, prefix);
                    }
                });
            });

            if (defaultTab === 'server') {
                this.loadServerTab(modal, prefix);
            }
        }, modalOptions);
    }

    /**
     * Insert an image from a URL.
     *
     * Applies the onImageInsert hook when configured. Pass options.source / options.serverItem
     * when calling programmatically from a host application that needs to identify the origin.
     *
     * @param {string} url     - The image URL
     * @param {string} alt     - The alt text
     * @param {Object} options - Optional: { source?: 'url'|'upload'|'server', serverItem?: Object|null }
     */
    insertImageFromUrl(url, alt = '', options = {}) {
        this._insertImage(url, alt, options.source || 'url', options.serverItem || null);
    }

    /**
     * Insert an image from a file.
     *
     * When onImageUpload is configured, delegates to that callback so the host
     * application can upload the file to a server and insert a permanent URL.
     * Falls back to a base64 data URI when no upload handler is provided.
     *
     * @param {File} file - The image file
     * @param {string} alt - The alt text
     */
    insertImageFromFile(file, alt = '') {
        if (!this.config.allowedImageTypes.includes(file.type)) {
            alert(this.t('alert.invalidImageType') + this.config.allowedImageTypes.join(', '));
            return;
        }

        if (file.size > this.config.maxImageSize) {
            const maxMB = Math.round(this.config.maxImageSize / 1024 / 1024);
            alert(this.t('alert.imageTooLarge') + maxMB + 'MB');
            return;
        }

        if (typeof this.config.onImageUpload === 'function') {
            this.config.onImageUpload(file, alt, (url, serverItem) => {
                this._insertImage(url, alt, 'upload', serverItem ?? null);
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this._insertImage(e.target.result, alt, 'upload', null);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Build and insert image HTML, applying the onImageInsert hook if configured.
     *
     * Calls onImageInsert({ url, alt, source, serverItem }) and uses its return value:
     *   - string  → inserted verbatim as HTML
     *   - object  → key/value pairs merged as extra attributes on a plain <img>
     *   - null/undefined → plain <img src alt>
     *
     * @param {string}      url        - Resolved image URL or base64 data URI
     * @param {string}      alt        - Alt text
     * @param {string}      source     - 'url' | 'upload' | 'server'
     * @param {Object|null} serverItem - Full server item object (only when source === 'server')
     */
    _insertImage(url, alt, source, serverItem) {
        let html;

        if (typeof this.config.onImageInsert === 'function') {
            const result = this.config.onImageInsert({ url, alt, source, serverItem });
            if (typeof result === 'string') {
                html = result;
            } else if (result !== null && result !== undefined && typeof result === 'object') {
                const extraAttrs = Object.entries(result)
                    .map(([k, v]) => ` ${k}="${this.escapeHtml(String(v))}"`)
                    .join('');
                html = `<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}"${extraAttrs}>`;
            }
        }

        if (!html) {
            html = `<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}">`;
        }

        this.restoreSelection();
        document.execCommand('insertHTML', false, html);
        this.sync();
    }

    /**
     * Show the gallery picker modal.
     */
    showGalleryModal() {
        const prefix = this.config.classPrefix;

        this.saveSelection();

        const content = `
            <div class="${prefix}-modal-header">${this.t('modal.galleryPickerTitle')}</div>
            <div class="${prefix}-modal-body">
                <div class="${prefix}-gallery-grid-area">
                    <div class="${prefix}-gallery-message">${this.t('modal.serverLoading')}</div>
                </div>
                <div class="${prefix}-gallery-pager"></div>
            </div>
            <div class="${prefix}-modal-footer">
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-secondary" data-action="cancel">${this.t('modal.cancel')}</button>
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-primary" data-action="insert" disabled>${this.t('modal.insert')}</button>
            </div>
        `;

        this.showModal(content, (modal) => {
            const state = modal._galleryState;
            if (state && state.selectedItem) {
                this._insertGallery(state.selectedItem, 'picker');
            }
        }, (modal) => {
            this.loadGalleryTab(modal, prefix);
        }, { modalClass: `${prefix}-modal-wide` });
    }

    /**
     * Initialise gallery picker state and wire pager. Re-entrant guard via dataset flag.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    loadGalleryTab(modal, prefix) {
        if (modal.dataset.galleryLoaded) return;
        modal.dataset.galleryLoaded = '1';

        modal._galleryState = {
            page: 1,
            pageSize: this.config.serverGalleriesPageSize,
            items: [],
            total: 0,
            selectedItem: null,
            abortController: null,
            arraySource: null,
        };

        const cfg = this.config.serverGalleries;
        if (cfg == null) {
            this.setGalleryError(modal, prefix, this.t('modal.galleryNotConfigured'), null);
            return;
        }
        if (Array.isArray(cfg)) {
            modal._galleryState.arraySource = cfg;
        }

        const pager = modal.querySelector(`.${prefix}-gallery-pager`);
        pager.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-page]');
            if (!btn || btn.disabled) return;
            modal._galleryState.selectedItem = null;
            modal.querySelector('[data-action="insert"]').disabled = true;
            modal._galleryState.page = parseInt(btn.dataset.page, 10);
            this.reloadGalleryTab(modal, prefix);
        });

        this.reloadGalleryTab(modal, prefix);
    }

    /**
     * Dispatch to array or URL loader based on source type.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    reloadGalleryTab(modal, prefix) {
        if (modal._galleryState.arraySource !== null) {
            this.loadGalleryArrayPage(modal, prefix);
        } else {
            this.fetchGalleryPage(modal, prefix);
        }
    }

    /**
     * Fetch one page of galleries from the URL endpoint.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    fetchGalleryPage(modal, prefix) {
        const state = modal._galleryState;

        state.abortController?.abort();
        const controller = new AbortController();
        state.abortController = controller;

        this.setGalleryLoading(modal, prefix);

        const qs = new URLSearchParams({
            page: state.page,
            pageSize: state.pageSize,
        }).toString();

        fetch(`${this.config.serverGalleries}?${qs}`, {
            credentials: 'same-origin',
            signal: controller.signal,
        })
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(data => {
                if (controller.signal.aborted) return;
                if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
                    throw new Error('Invalid envelope');
                }
                state.items    = data.items;
                state.total    = data.total    ?? data.items.length;
                state.page     = data.page     ?? state.page;
                state.pageSize = data.pageSize ?? state.pageSize;
                this.renderGalleryGrid(modal, prefix);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                this.setGalleryError(modal, prefix, this.t('modal.galleryError'), () => {
                    this.fetchGalleryPage(modal, prefix);
                });
            });
    }

    /**
     * Paginate an inline Array source and render.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    loadGalleryArrayPage(modal, prefix) {
        const state    = modal._galleryState;
        state.total    = state.arraySource.length;
        const start    = (state.page - 1) * state.pageSize;
        state.items    = state.arraySource.slice(start, start + state.pageSize);
        this.renderGalleryGrid(modal, prefix);
    }

    /**
     * Render the gallery card grid and pager from current state.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderGalleryGrid(modal, prefix) {
        const state     = modal._galleryState;
        const container = modal.querySelector(`.${prefix}-gallery-grid-area`);
        const insertBtn = modal.querySelector('[data-action="insert"]');
        container.replaceChildren();

        if (state.items.length === 0) {
            const msg = document.createElement('div');
            msg.className = `${prefix}-gallery-message`;
            msg.textContent = this.t('modal.galleryEmpty');
            container.appendChild(msg);
            this.renderGalleryPager(modal, prefix);
            return;
        }

        const grid = document.createElement('div');
        grid.className = `${prefix}-gallery-grid`;

        state.items.forEach(item => {
            const card = document.createElement('div');
            card.className = `${prefix}-gallery-card`;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'option');
            card.setAttribute('aria-selected', 'false');

            const thumb = document.createElement('div');
            thumb.className = `${prefix}-gallery-card__thumb`;
            if (item.cover) {
                const img = document.createElement('img');
                img.src     = item.cover;
                img.alt     = '';
                img.loading = 'lazy';
                thumb.appendChild(img);
            } else {
                const ph = document.createElement('span');
                ph.setAttribute('aria-hidden', 'true');
                ph.textContent = '🖼';
                thumb.appendChild(ph);
            }

            const info    = document.createElement('div');
            info.className = `${prefix}-gallery-card__info`;

            const nameEl = document.createElement('div');
            nameEl.className  = `${prefix}-gallery-card__name`;
            nameEl.textContent = item.name;

            const countEl = document.createElement('div');
            countEl.className  = `${prefix}-gallery-card__count`;
            countEl.textContent = this.t('modal.galleryImageCount')
                .replace('%d', String(item.image_count ?? 0));

            info.appendChild(nameEl);
            info.appendChild(countEl);
            card.appendChild(thumb);
            card.appendChild(info);

            const selectCard = () => {
                grid.querySelectorAll(`.${prefix}-gallery-card`).forEach(c => {
                    c.classList.remove(`${prefix}-gallery-card--selected`);
                    c.setAttribute('aria-selected', 'false');
                });
                card.classList.add(`${prefix}-gallery-card--selected`);
                card.setAttribute('aria-selected', 'true');
                state.selectedItem  = item;
                insertBtn.disabled  = false;
            };

            card.addEventListener('click', selectCard);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCard(); }
            });

            if (state.selectedItem && state.selectedItem.id === item.id) {
                card.classList.add(`${prefix}-gallery-card--selected`);
                card.setAttribute('aria-selected', 'true');
            }

            grid.appendChild(card);
        });

        container.appendChild(grid);
        this.renderGalleryPager(modal, prefix);
    }

    /**
     * Render pagination controls for the gallery picker.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderGalleryPager(modal, prefix) {
        const state = modal._galleryState;
        const pager = modal.querySelector(`.${prefix}-gallery-pager`);
        pager.replaceChildren();

        const totalPages = Math.ceil(state.total / state.pageSize);
        if (totalPages <= 1) return;

        const prev = document.createElement('button');
        prev.type        = 'button';
        prev.textContent = `« ${this.t('modal.serverPagePrev')}`;
        prev.dataset.page = state.page - 1;
        prev.disabled    = state.page <= 1;
        pager.appendChild(prev);

        const info = document.createElement('span');
        info.textContent = this.t('modal.serverPageOf')
            .replace('%1', state.page)
            .replace('%2', totalPages);
        pager.appendChild(info);

        const next = document.createElement('button');
        next.type        = 'button';
        next.textContent = `${this.t('modal.serverPageNext')} »`;
        next.dataset.page = state.page + 1;
        next.disabled    = state.page >= totalPages;
        pager.appendChild(next);
    }

    /**
     * Show a loading indicator in the gallery grid area.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    setGalleryLoading(modal, prefix) {
        const container = modal.querySelector(`.${prefix}-gallery-grid-area`);
        if (!container) return;
        container.replaceChildren();
        const msg = document.createElement('div');
        msg.className  = `${prefix}-gallery-message`;
        msg.textContent = this.t('modal.serverLoading');
        container.appendChild(msg);
    }

    /**
     * Show an error message in the gallery grid area with an optional Retry button.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     * @param {string} message
     * @param {Function|null} onRetry
     */
    setGalleryError(modal, prefix, message, onRetry) {
        const container = modal.querySelector(`.${prefix}-gallery-grid-area`);
        if (!container) return;
        container.replaceChildren();
        const msg = document.createElement('div');
        msg.className  = `${prefix}-gallery-message`;
        msg.textContent = message;
        if (onRetry) {
            const btn = document.createElement('button');
            btn.type        = 'button';
            btn.textContent = this.t('modal.retry');
            btn.addEventListener('click', onRetry);
            msg.appendChild(btn);
        }
        container.appendChild(msg);
    }

    /**
     * Build and insert gallery embed HTML, applying the onGalleryInsert hook if configured.
     *
     * Calls onGalleryInsert({ gallery, source }) and uses its return value:
     *   - string → inserted verbatim as HTML
     *   - null/undefined → block-level placeholder div
     *
     * @param {Object} item   - Gallery item object from the picker state
     * @param {string} source - 'picker'
     */
    _insertGallery(item, source) {
        let html;

        if (typeof this.config.onGalleryInsert === 'function') {
            const result = this.config.onGalleryInsert({ gallery: item, source });
            if (typeof result === 'string') {
                html = result;
            }
        }

        if (!html) {
            const prefix = this.config.classPrefix;
            html = `<div class="${prefix}-gallery-embed" data-gallery-id="${parseInt(item.id, 10)}" contenteditable="false">${this.escapeHtml(String(item.name ?? ''))}</div>`;
        }

        this.restoreSelection();
        document.execCommand('insertHTML', false, html);
        this.sync();
    }

    /**
     * Initialize and show the Server tab: set up per-modal state, wire event handlers,
     * and kick off the first load. Re-entrant: safe to call multiple times; only runs once.
     *
     * @param {HTMLElement} modal - The modal root element
     * @param {string} prefix - CSS class prefix
     */
    loadServerTab(modal, prefix) {
        if (modal.dataset.serverLoaded) return;
        modal.dataset.serverLoaded = '1';

        modal._serverState = {
            folder: '',
            query: '',
            page: 1,
            pageSize: this.config.serverImagesPageSize,
            selectedUrl: null,
            selectedItem: null,
            folderTree: null,
            items: [],
            total: 0,
            abortController: null,
            arraySource: null,
            searchDebounce: null,
        };

        const cfg = this.config.serverImages;
        if (cfg == null) {
            this.setServerError(modal, prefix, this.t('modal.serverNotConfigured'), null);
            return;
        }
        if (Array.isArray(cfg)) {
            modal._serverState.arraySource = cfg;
            modal._serverState.folderTree = this.inferFolderTreeFromArray(cfg);
        }

        this.attachServerSearchHandler(modal, prefix);

        const sidebar = modal.querySelector(`.${prefix}-server-folder-tree`);
        sidebar.addEventListener('click', (e) => {
            const li = e.target.closest('li[data-folder]');
            if (!li) return;
            modal._serverState.selectedUrl  = null;
            modal._serverState.selectedItem = null;
            modal._serverState.folder = li.dataset.folder;
            modal._serverState.page = 1;
            this.reloadServerTab(modal, prefix);
        });

        const pager = modal.querySelector(`.${prefix}-server-pager`);
        pager.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-page]');
            if (!btn || btn.disabled) return;
            modal._serverState.selectedUrl  = null;
            modal._serverState.selectedItem = null;
            modal._serverState.page = parseInt(btn.dataset.page, 10);
            this.reloadServerTab(modal, prefix);
        });

        this.reloadServerTab(modal, prefix);
    }

    /**
     * Dispatch to the appropriate loader based on whether the source is an Array or URL.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    reloadServerTab(modal, prefix) {
        if (modal._serverState.arraySource !== null) {
            this.loadServerArrayPage(modal, prefix);
        } else {
            this.fetchServerImagesPage(modal, prefix);
        }
    }

    /**
     * Fetch one page of images from the URL endpoint, honouring current state.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    fetchServerImagesPage(modal, prefix) {
        const state = modal._serverState;

        state.abortController?.abort();
        const controller = new AbortController();
        state.abortController = controller;

        this.setServerLoading(modal, prefix);

        const qs = new URLSearchParams({
            page: state.page,
            pageSize: state.pageSize,
            q: state.query,
            folder: state.folder,
        }).toString();

        fetch(`${this.config.serverImages}?${qs}`, {
            credentials: 'same-origin',
            signal: controller.signal,
        })
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(data => {
                if (controller.signal.aborted) return;
                if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
                    throw new Error('Invalid envelope');
                }
                if (data.items.length === 0 && data.total > 0) {
                    state.page = 1;
                    this.fetchServerImagesPage(modal, prefix);
                    return;
                }
                state.items = data.items;
                state.total = data.total;
                state.page = data.page;
                state.pageSize = data.pageSize;
                state.folder = data.folder;
                state.folderTree = data.folderTree || [];
                this.renderServerTab(modal, prefix);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                this.setServerError(modal, prefix, this.t('modal.serverError'), () => {
                    this.fetchServerImagesPage(modal, prefix);
                });
            });
    }

    /**
     * Filter and paginate the inline Array source in memory, then render.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    loadServerArrayPage(modal, prefix) {
        const state = modal._serverState;
        const q = state.query.toLowerCase();

        const filtered = state.arraySource.filter(item => {
            const urlPath = item.url.includes('/') ? item.url.substring(0, item.url.lastIndexOf('/')) : '';
            const folderMatch = urlPath === state.folder;
            const queryMatch = !q || item.name.toLowerCase().includes(q);
            return folderMatch && queryMatch;
        });

        state.total = filtered.length;
        const start = (state.page - 1) * state.pageSize;
        state.items = filtered.slice(start, start + state.pageSize);

        this.renderServerTab(modal, prefix);
    }

    /**
     * Render sidebar, breadcrumb, image grid, and pager from current state.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderServerTab(modal, prefix) {
        this.renderFolderSidebar(modal, prefix);
        this.renderBreadcrumb(modal, prefix);
        const gridArea = modal.querySelector(`.${prefix}-server-grid-area`);
        this.renderServerImageGrid(gridArea, modal._serverState, prefix);
        this.renderPager(modal, prefix);
    }

    /**
     * Build the folder sidebar from state.folderTree.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderFolderSidebar(modal, prefix) {
        const state = modal._serverState;
        const ul = modal.querySelector(`.${prefix}-server-folder-tree`);
        ul.replaceChildren();

        const rootLi = document.createElement('li');
        rootLi.dataset.folder = '';
        rootLi.textContent = this.t('modal.serverRoot');
        if (state.folder === '') rootLi.classList.add(`${prefix}-server-folder-active`);
        ul.appendChild(rootLi);

        (state.folderTree || []).forEach(folderPath => {
            const depth = folderPath.split('/').length - 1;
            const li = document.createElement('li');
            li.dataset.folder = folderPath;
            li.style.paddingLeft = `${6 + depth * 12}px`;
            const name = folderPath.split('/').pop();
            li.textContent = name;
            if (folderPath === state.folder) li.classList.add(`${prefix}-server-folder-active`);
            ul.appendChild(li);
        });
    }

    /**
     * Render the breadcrumb path for the current folder.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderBreadcrumb(modal, prefix) {
        const state = modal._serverState;
        const bc = modal.querySelector(`.${prefix}-server-breadcrumb`);
        bc.replaceChildren();

        const rootSpan = document.createElement('span');
        rootSpan.textContent = this.t('modal.serverRoot');
        rootSpan.addEventListener('click', () => {
            state.selectedUrl  = null;
            state.selectedItem = null;
            state.folder = '';
            state.page = 1;
            this.reloadServerTab(modal, prefix);
        });
        bc.appendChild(rootSpan);

        if (state.folder) {
            const parts = state.folder.split('/');
            parts.forEach((part, i) => {
                const sep = document.createTextNode(' › ');
                bc.appendChild(sep);
                const span = document.createElement('span');
                span.textContent = part;
                const targetFolder = parts.slice(0, i + 1).join('/');
                span.addEventListener('click', () => {
                    state.selectedUrl  = null;
                    state.selectedItem = null;
                    state.folder = targetFolder;
                    state.page = 1;
                    this.reloadServerTab(modal, prefix);
                });
                bc.appendChild(span);
            });
        }
    }

    /**
     * Render the image grid inside the given container from state.
     *
     * @param {HTMLElement} container - The grid-area element
     * @param {Object} state - Per-modal server state
     * @param {string} prefix - CSS class prefix
     */
    renderServerImageGrid(container, state, prefix) {
        container.replaceChildren();

        if (state.items.length === 0) {
            const msg = document.createElement('div');
            msg.className = `${prefix}-server-images-message`;
            msg.textContent = state.query
                ? this.t('modal.serverNoResults')
                : this.t('modal.serverEmpty');
            container.appendChild(msg);
            return;
        }

        const grid = document.createElement('div');
        grid.className = `${prefix}-server-images-grid`;

        state.items.forEach(item => {
            const cell = document.createElement('div');
            cell.className = `${prefix}-server-image`;
            cell.dataset.url = item.url;
            if (item.url === state.selectedUrl) {
                cell.classList.add(`${prefix}-server-image-selected`);
            }

            const img = document.createElement('img');
            img.src = item.thumb || item.url;
            img.alt = item.name;
            img.draggable = false;

            const label = document.createElement('div');
            label.className = `${prefix}-server-image-name`;
            label.textContent = item.name;

            cell.appendChild(img);
            cell.appendChild(label);

            cell.addEventListener('click', () => {
                grid.querySelectorAll(`.${prefix}-server-image`).forEach(el => {
                    el.classList.remove(`${prefix}-server-image-selected`);
                });
                cell.classList.add(`${prefix}-server-image-selected`);
                state.selectedUrl  = item.url;
                state.selectedItem = item;
            });

            grid.appendChild(cell);
        });

        container.appendChild(grid);
    }

    /**
     * Render pagination controls below the grid.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    renderPager(modal, prefix) {
        const state = modal._serverState;
        const pager = modal.querySelector(`.${prefix}-server-pager`);
        pager.replaceChildren();

        const totalPages = Math.ceil(state.total / state.pageSize);
        if (totalPages <= 1) return;

        const prev = document.createElement('button');
        prev.type = 'button';
        prev.textContent = `« ${this.t('modal.serverPagePrev')}`;
        prev.dataset.page = state.page - 1;
        prev.disabled = state.page <= 1;
        pager.appendChild(prev);

        const info = document.createElement('span');
        info.textContent = this.t('modal.serverPageOf')
            .replace('%1', state.page)
            .replace('%2', totalPages);
        pager.appendChild(info);

        const next = document.createElement('button');
        next.type = 'button';
        next.textContent = `${this.t('modal.serverPageNext')} »`;
        next.dataset.page = state.page + 1;
        next.disabled = state.page >= totalPages;
        pager.appendChild(next);
    }

    /**
     * Infer a sorted flat list of folder paths from an Array of image items.
     *
     * @param {Array<{url: string}>} items
     * @returns {string[]}
     */
    inferFolderTreeFromArray(items) {
        const folders = new Set();
        items.forEach(item => {
            if (!item.url.includes('/')) return;
            const parts = item.url.split('/');
            parts.pop();
            parts.forEach((_, i) => {
                folders.add(parts.slice(0, i + 1).join('/'));
            });
        });
        return Array.from(folders).sort();
    }

    /**
     * Wire the search input with a 300ms debounce on the modal.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    attachServerSearchHandler(modal, prefix) {
        const input = modal.querySelector(`.${prefix}-server-search`);
        if (!input) return;
        input.addEventListener('input', () => {
            const state = modal._serverState;
            clearTimeout(state.searchDebounce);
            state.searchDebounce = setTimeout(() => {
                state.selectedUrl  = null;
                state.selectedItem = null;
                state.query = input.value;
                state.page = 1;
                this.reloadServerTab(modal, prefix);
            }, 300);
        });
    }

    /**
     * Show a loading indicator in the grid area only.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     */
    setServerLoading(modal, prefix) {
        const gridArea = modal.querySelector(`.${prefix}-server-grid-area`);
        if (!gridArea) return;
        gridArea.replaceChildren();
        const msg = document.createElement('div');
        msg.className = `${prefix}-server-images-message`;
        msg.textContent = this.t('modal.serverLoading');
        gridArea.appendChild(msg);
    }

    /**
     * Show an error message in the grid area with an optional Retry button.
     *
     * @param {HTMLElement} modal
     * @param {string} prefix
     * @param {string} message
     * @param {Function|null} onRetry
     */
    setServerError(modal, prefix, message, onRetry) {
        const gridArea = modal.querySelector(`.${prefix}-server-grid-area`);
        if (!gridArea) return;
        gridArea.replaceChildren();
        const msg = document.createElement('div');
        msg.className = `${prefix}-server-images-message`;
        msg.textContent = message;
        if (onRetry) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = this.t('modal.retry');
            btn.addEventListener('click', onRetry);
            msg.appendChild(btn);
        }
        gridArea.appendChild(msg);
    }

    /**
     * Show a modal dialog
     *
     * @param {string} content - The modal HTML content
     * @param {Function} onConfirm - Callback when confirm button is clicked
     * @param {Function} onSetup - Optional callback for additional setup after modal is created
     * @param {Object} options - Optional configuration: { modalClass }
     * @private
     */
    showModal(content, onConfirm, onSetup = null, options = {}) {
        const prefix = this.config.classPrefix;

        const overlay = document.createElement('div');
        overlay.className = `${prefix}-modal-overlay`;

        const modal = document.createElement('div');
        modal.className = `${prefix}-modal${options.modalClass ? ' ' + options.modalClass : ''}`;
        modal.innerHTML = content;

        overlay.appendChild(modal);

        // Append to closest Bootstrap modal if inside one (to work with Bootstrap's focus trap)
        // Otherwise append to document.body
        const bootstrapModal = this.wrapper.closest('.modal');
        if (bootstrapModal) {
            bootstrapModal.appendChild(overlay);
        } else {
            document.body.appendChild(overlay);
        }

        // Prevent all input events from bubbling (fixes focus/click/typing issues)
        modal.querySelectorAll('input, textarea').forEach(input => {
            ['click', 'mousedown', 'mouseup', 'focus', 'keydown', 'keyup', 'keypress', 'input'].forEach(eventType => {
                input.addEventListener(eventType, (e) => e.stopPropagation());
            });
        });

        // Prevent modal from losing focus when clicking inside
        modal.addEventListener('mousedown', (e) => e.stopPropagation());

        // Run setup callback if provided
        if (onSetup) {
            onSetup(modal);
        }

        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }

        // Handle button clicks (only on buttons with data-action)
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            if (action === 'cancel') {
                this.closeModal(overlay);
            } else if (action === 'insert') {
                onConfirm(modal);
                this.closeModal(overlay);
            }
        });

        // Handle ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Handle click outside modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
            }
        });
    }

    /**
     * Close a modal dialog
     *
     * @param {HTMLElement} overlay - The modal overlay element
     * @private
     */
    closeModal(overlay) {
        const modal = overlay.firstElementChild;
        if (modal && modal._serverState) {
            modal._serverState.abortController?.abort();
            clearTimeout(modal._serverState.searchDebounce);
        }
        if (modal && modal._galleryState) {
            modal._galleryState.abortController?.abort();
        }
        overlay.remove();
    }

    /**
     * Select an image for editing
     *
     * @param {HTMLImageElement} img - The image element to select
     */
    selectImage(img) {
        // Deselect any previously selected image
        this.deselectImage();

        const prefix = this.config.classPrefix;
        this.selectedImage = img;
        img.classList.add(`${prefix}-image-selected`);

        // Create and show toolbar
        this.showImageToolbar(img);

        // Create and show resizer
        this.showImageResizer(img);
    }

    /**
     * Deselect the currently selected image
     */
    deselectImage() {
        if (!this.selectedImage) return;

        const prefix = this.config.classPrefix;
        this.selectedImage.classList.remove(`${prefix}-image-selected`);
        this.selectedImage = null;

        // Remove toolbar
        if (this.imageToolbar) {
            this.imageToolbar.remove();
            this.imageToolbar = null;
        }

        // Remove resizer
        if (this.imageResizer) {
            this.imageResizer.remove();
            this.imageResizer = null;
        }
    }

    /**
     * Show the image editing toolbar
     *
     * @param {HTMLImageElement} img - The image element
     * @private
     */
    showImageToolbar(img) {
        const prefix = this.config.classPrefix;

        this.imageToolbar = document.createElement('div');
        this.imageToolbar.className = `${prefix}-image-toolbar`;
        this.imageToolbar.innerHTML = `
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="edit-alt" title="${this.t('imageToolbar.editAlt')}">Alt</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-50" title="${this.t('imageToolbar.resize50')}">50%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-100" title="${this.t('imageToolbar.resize100')}">100%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="delete" title="${this.t('imageToolbar.delete')}">${StarEditor.icons.delete}</button>
        `;

        // Position toolbar above the image
        this.wrapper.appendChild(this.imageToolbar);
        this.updateToolbarPosition(img);

        // Handle toolbar button clicks
        this.imageToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            this.handleImageAction(action);
        });
    }

    /**
     * Show the image resizer with drag handles
     *
     * @param {HTMLImageElement} img - The image element
     * @private
     */
    showImageResizer(img) {
        const prefix = this.config.classPrefix;

        this.imageResizer = document.createElement('div');
        this.imageResizer.className = `${prefix}-image-resizer`;
        this.imageResizer.innerHTML = `
            <div class="${prefix}-image-handle ${prefix}-image-handle-se" data-handle="se"></div>
            <div class="${prefix}-image-handle ${prefix}-image-handle-sw" data-handle="sw"></div>
            <div class="${prefix}-image-handle ${prefix}-image-handle-ne" data-handle="ne"></div>
            <div class="${prefix}-image-handle ${prefix}-image-handle-nw" data-handle="nw"></div>
        `;

        this.updateResizerPosition(img);

        // Handle resize drag
        this.imageResizer.querySelectorAll('[data-handle]').forEach(handle => {
            handle.addEventListener('mousedown', (e) => this.startImageResize(e, handle.dataset.handle));
        });

        this.wrapper.appendChild(this.imageResizer);
    }

    /**
     * Update the resizer position to match the image
     *
     * @param {HTMLImageElement} img - The image element
     * @private
     */
    updateResizerPosition(img) {
        if (!this.imageResizer) return;

        // Calculate position relative to the editor
        let left = img.offsetLeft;
        let top = img.offsetTop;

        // Walk up the offset parents until we reach the editor
        let parent = img.offsetParent;
        while (parent && parent !== this.editor) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }

        // Add editor's offset within wrapper (accounts for main toolbar)
        left += this.editor.offsetLeft;
        top += this.editor.offsetTop;

        this.imageResizer.style.left = `${left}px`;
        this.imageResizer.style.top = `${top}px`;
        this.imageResizer.style.width = `${img.offsetWidth}px`;
        this.imageResizer.style.height = `${img.offsetHeight}px`;
    }

    /**
     * Start resizing an image
     *
     * @param {MouseEvent} e - The mousedown event
     * @param {string} handle - The handle position (se, sw, ne, nw)
     * @private
     */
    startImageResize(e, handle) {
        if (!this.selectedImage) return;

        e.preventDefault();
        e.stopPropagation();

        const img = this.selectedImage;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;
        const aspectRatio = startWidth / startHeight;

        const onMouseMove = (moveEvent) => {
            let deltaX = moveEvent.clientX - startX;
            let deltaY = moveEvent.clientY - startY;

            // Adjust delta based on handle position
            if (handle === 'nw' || handle === 'sw') {
                deltaX = -deltaX;
            }
            if (handle === 'nw' || handle === 'ne') {
                deltaY = -deltaY;
            }

            // Calculate new size maintaining aspect ratio
            let newWidth = startWidth + deltaX;
            let newHeight = newWidth / aspectRatio;

            // Minimum size
            if (newWidth < 50) {
                newWidth = 50;
                newHeight = newWidth / aspectRatio;
            }

            // Apply new size
            img.style.width = `${Math.round(newWidth)}px`;
            img.style.height = 'auto';

            // Update resizer position
            this.updateResizerPosition(img);
            this.updateToolbarPosition(img);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.sync();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    /**
     * Update the toolbar position to match the image
     *
     * @param {HTMLImageElement} img - The image element
     * @private
     */
    updateToolbarPosition(img) {
        if (!this.imageToolbar) return;

        // Calculate position relative to the editor
        let left = img.offsetLeft;
        let top = img.offsetTop;

        // Walk up the offset parents until we reach the editor
        let parent = img.offsetParent;
        while (parent && parent !== this.editor) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }

        // Add editor's offset within wrapper (accounts for main toolbar)
        left += this.editor.offsetLeft;
        top += this.editor.offsetTop;

        this.imageToolbar.style.left = `${left}px`;
        this.imageToolbar.style.top = `${top - 36}px`;
    }

    /**
     * Handle image toolbar actions
     *
     * @param {string} action - The action to perform
     * @private
     */
    handleImageAction(action) {
        if (!this.selectedImage) return;

        const img = this.selectedImage;

        switch (action) {
            case 'edit-alt':
                this.editImageAlt(img);
                break;
            case 'resize-50':
                img.style.width = '50%';
                img.style.height = 'auto';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'resize-100':
                img.style.width = '';
                img.style.height = '';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'delete':
                this.deleteImage(img);
                break;
        }
    }

    /**
     * Edit the alt text of an image
     *
     * @param {HTMLImageElement} img - The image element
     */
    editImageAlt(img) {
        const prefix = this.config.classPrefix;
        const currentAlt = img.alt || '';

        const content = `
            <div class="${prefix}-modal-header">${this.t('modal.editAltText')}</div>
            <div class="${prefix}-modal-body">
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.altText')}</label>
                    <input type="text" class="${prefix}-modal-input" id="${prefix}-edit-alt" value="${this.escapeHtml(currentAlt)}" placeholder="${this.t('modal.altPlaceholder')}">
                </div>
            </div>
            <div class="${prefix}-modal-footer">
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-secondary" data-action="cancel">${this.t('modal.cancel')}</button>
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-primary" data-action="insert">${this.t('modal.save')}</button>
            </div>
        `;

        this.showModal(content, (modal) => {
            const newAlt = modal.querySelector(`#${prefix}-edit-alt`).value;
            img.alt = newAlt;
            this.sync();
        });
    }

    /**
     * Delete the selected image
     *
     * @param {HTMLImageElement} img - The image element
     */
    deleteImage(img) {
        this.deselectImage();
        img.remove();
        this.sync();
    }

    /**
     * Select a table for editing
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement} cell - The clicked cell (optional)
     */
    selectTable(table, cell = null) {
        // Deselect any previously selected table
        this.deselectTable();

        const prefix = this.config.classPrefix;
        this.selectedTable = table;
        this.selectedCell = cell;
        table.classList.add(`${prefix}-table-selected`);

        // Create and show toolbar
        this.showTableToolbar(table);
    }

    /**
     * Deselect the currently selected table
     */
    deselectTable() {
        if (!this.selectedTable) return;

        const prefix = this.config.classPrefix;
        this.selectedTable.classList.remove(`${prefix}-table-selected`);
        this.selectedTable = null;
        this.selectedCell = null;

        // Remove toolbar
        if (this.tableToolbar) {
            this.tableToolbar.remove();
            this.tableToolbar = null;
        }
    }

    /**
     * Show the table editing toolbar
     *
     * @param {HTMLTableElement} table - The table element
     * @private
     */
    showTableToolbar(table) {
        const prefix = this.config.classPrefix;

        this.tableToolbar = document.createElement('div');
        this.tableToolbar.className = `${prefix}-table-toolbar`;
        this.tableToolbar.innerHTML = `
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="properties" title="${this.t('tableToolbar.properties')}">${StarEditor.icons.table_properties}${this.t('tableToolbar.propertiesLabel')}</button>
            <span class="${prefix}-table-toolbar-separator"></span>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="row-above" title="${this.t('tableToolbar.rowAbove')}">${StarEditor.icons.insert_row_above}${this.t('tableToolbar.rowAboveLabel')}</button>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="row-below" title="${this.t('tableToolbar.rowBelow')}">${StarEditor.icons.insert_row_below}${this.t('tableToolbar.rowBelowLabel')}</button>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="col-left" title="${this.t('tableToolbar.colLeft')}">${StarEditor.icons.insert_column_left}${this.t('tableToolbar.colLeftLabel')}</button>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="col-right" title="${this.t('tableToolbar.colRight')}">${StarEditor.icons.insert_column_right}${this.t('tableToolbar.colRightLabel')}</button>
            <span class="${prefix}-table-toolbar-separator"></span>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="delete-row" title="${this.t('tableToolbar.deleteRow')}">${StarEditor.icons.delete_row}${this.t('tableToolbar.deleteRowLabel')}</button>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="delete-col" title="${this.t('tableToolbar.deleteCol')}">${StarEditor.icons.delete_column}${this.t('tableToolbar.deleteColLabel')}</button>
            <button type="button" class="${prefix}-table-toolbar-btn" data-action="delete-table" title="${this.t('tableToolbar.deleteTable')}">${StarEditor.icons.delete}${this.t('tableToolbar.deleteTableLabel')}</button>
        `;

        // Position toolbar above the table
        this.wrapper.appendChild(this.tableToolbar);
        this.updateTableToolbarPosition(table);

        // Handle toolbar button clicks
        this.tableToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            this.handleTableAction(action);
        });
    }

    /**
     * Update the table toolbar position
     *
     * @param {HTMLTableElement} table - The table element
     * @private
     */
    updateTableToolbarPosition(table) {
        if (!this.tableToolbar) return;

        // Calculate position relative to the editor
        let left = table.offsetLeft;
        let top = table.offsetTop;

        // Walk up the offset parents until we reach the editor
        let parent = table.offsetParent;
        while (parent && parent !== this.editor) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }

        // Add editor's offset within wrapper (accounts for main toolbar)
        left += this.editor.offsetLeft;
        top += this.editor.offsetTop;

        this.tableToolbar.style.left = `${left}px`;
        this.tableToolbar.style.top = `${top - this.tableToolbar.offsetHeight - 5}px`;
    }

    /**
     * Handle table toolbar actions
     *
     * @param {string} action - The action to perform
     * @private
     */
    handleTableAction(action) {
        const table = this.selectedTable;
        const cell = this.selectedCell;

        if (!table) return;

        switch (action) {
            case 'properties':
                this.showTablePropertiesModal(table);
                break;
            case 'row-above':
                this.insertTableRow(table, cell, 'above');
                break;
            case 'row-below':
                this.insertTableRow(table, cell, 'below');
                break;
            case 'col-left':
                this.insertTableColumn(table, cell, 'left');
                break;
            case 'col-right':
                this.insertTableColumn(table, cell, 'right');
                break;
            case 'delete-row':
                this.deleteTableRow(table, cell);
                break;
            case 'delete-col':
                this.deleteTableColumn(table, cell);
                break;
            case 'delete-table':
                this.deleteTable(table);
                break;
        }
    }

    /**
     * Show the table properties modal
     *
     * @param {HTMLTableElement} table - The table element
     */
    showTablePropertiesModal(table) {
        const prefix = this.config.classPrefix;

        // Get current table styles
        const computedStyle = window.getComputedStyle(table);
        const cells = table.querySelectorAll('td, th');
        const firstCell = cells[0];
        const cellStyle = firstCell ? window.getComputedStyle(firstCell) : null;

        // Parse current values
        let borderWidth = '1';
        let borderColor = '#cccccc';
        let cellPadding = '8';
        let tableWidth = '100';

        if (cellStyle) {
            const borderMatch = cellStyle.borderWidth.match(/(\d+)/);
            if (borderMatch) borderWidth = borderMatch[1];
            borderColor = this.rgbToHex(cellStyle.borderColor) || '#cccccc';
            const paddingMatch = cellStyle.padding.match(/(\d+)/);
            if (paddingMatch) cellPadding = paddingMatch[1];
        }

        if (table.style.width) {
            const widthMatch = table.style.width.match(/(\d+)/);
            if (widthMatch) tableWidth = widthMatch[1];
        }

        const content = `
            <div class="${prefix}-modal-header">${this.t('modal.tableProperties')}</div>
            <div class="${prefix}-modal-body">
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.borderWidth')}</label>
                    <input type="number" class="${prefix}-modal-input" id="${prefix}-table-border" value="${borderWidth}" min="0" max="10">
                </div>
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.borderColor')}</label>
                    <input type="color" class="${prefix}-modal-input" id="${prefix}-table-border-color" value="${borderColor}" style="height: 36px; padding: 2px;">
                </div>
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.cellPadding')}</label>
                    <input type="number" class="${prefix}-modal-input" id="${prefix}-table-padding" value="${cellPadding}" min="0" max="50">
                </div>
                <div class="${prefix}-modal-row">
                    <label class="${prefix}-modal-label">${this.t('modal.tableWidth')}</label>
                    <input type="number" class="${prefix}-modal-input" id="${prefix}-table-width" value="${tableWidth}" min="10" max="100">
                </div>
            </div>
            <div class="${prefix}-modal-footer">
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-secondary" data-action="cancel">${this.t('modal.cancel')}</button>
                <button type="button" class="${prefix}-modal-btn ${prefix}-modal-btn-primary" data-action="insert">${this.t('modal.apply')}</button>
            </div>
        `;

        this.showModal(content, (modal) => {
            const borderWidth = modal.querySelector(`#${prefix}-table-border`).value;
            const borderColor = modal.querySelector(`#${prefix}-table-border-color`).value;
            const cellPadding = modal.querySelector(`#${prefix}-table-padding`).value;
            const tableWidth = modal.querySelector(`#${prefix}-table-width`).value;

            this.applyTableProperties(table, {
                borderWidth: parseInt(borderWidth, 10),
                borderColor: borderColor,
                cellPadding: parseInt(cellPadding, 10),
                tableWidth: parseInt(tableWidth, 10)
            });
        });
    }

    /**
     * Apply properties to a table
     *
     * @param {HTMLTableElement} table - The table element
     * @param {Object} props - The properties to apply
     * @private
     */
    applyTableProperties(table, props) {
        const { borderWidth, borderColor, cellPadding, tableWidth } = props;

        table.style.width = `${tableWidth}%`;

        // Apply border and padding to all cells
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
            cell.style.border = `${borderWidth}px solid ${borderColor}`;
            cell.style.padding = `${cellPadding}px`;
        });

        this.sync();
    }

    /**
     * Convert RGB color string to hex
     *
     * @param {string} rgb - RGB color string like "rgb(255, 0, 0)"
     * @returns {string} Hex color string like "#ff0000"
     * @private
     */
    rgbToHex(rgb) {
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return null;

        const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
        const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
        const b = parseInt(match[3], 10).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    }

    /**
     * Insert a new row into the table
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement} cell - The reference cell
     * @param {string} position - 'above' or 'below'
     */
    insertTableRow(table, cell, position) {
        const row = cell ? cell.closest('tr') : table.querySelector('tr');
        if (!row) return;

        const colCount = row.cells.length;
        const newRow = document.createElement('tr');

        for (let i = 0; i < colCount; i++) {
            const td = document.createElement('td');
            td.innerHTML = '&nbsp;';
            // Copy styles from existing cells
            const existingCell = row.cells[0];
            if (existingCell) {
                td.style.border = existingCell.style.border || '';
                td.style.padding = existingCell.style.padding || '';
            }
            newRow.appendChild(td);
        }

        if (position === 'above') {
            row.parentNode.insertBefore(newRow, row);
        } else {
            row.parentNode.insertBefore(newRow, row.nextSibling);
        }

        this.sync();
    }

    /**
     * Insert a new column into the table
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement} cell - The reference cell
     * @param {string} position - 'left' or 'right'
     */
    insertTableColumn(table, cell, position) {
        const cellIndex = cell ? cell.cellIndex : 0;
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const refCell = row.cells[cellIndex];
            if (!refCell) return;

            const isHeader = refCell.tagName === 'TH';
            const newCell = document.createElement(isHeader ? 'th' : 'td');
            newCell.innerHTML = '&nbsp;';
            // Copy styles from existing cells
            newCell.style.border = refCell.style.border || '';
            newCell.style.padding = refCell.style.padding || '';

            if (position === 'left') {
                row.insertBefore(newCell, refCell);
            } else {
                row.insertBefore(newCell, refCell.nextSibling);
            }
        });

        this.sync();
    }

    /**
     * Delete a row from the table
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement} cell - A cell in the row to delete
     */
    deleteTableRow(table, cell) {
        const row = cell ? cell.closest('tr') : null;
        if (!row) return;

        // Don't delete if it's the last row
        if (table.querySelectorAll('tr').length <= 1) {
            return;
        }

        row.remove();
        this.sync();
    }

    /**
     * Delete a column from the table
     *
     * @param {HTMLTableElement} table - The table element
     * @param {HTMLTableCellElement} cell - A cell in the column to delete
     */
    deleteTableColumn(table, cell) {
        if (!cell) return;

        const cellIndex = cell.cellIndex;
        const rows = table.querySelectorAll('tr');

        // Don't delete if it's the last column
        const firstRow = rows[0];
        if (firstRow && firstRow.cells.length <= 1) {
            return;
        }

        rows.forEach(row => {
            if (row.cells[cellIndex]) {
                row.cells[cellIndex].remove();
            }
        });

        this.sync();
    }

    /**
     * Delete a table
     *
     * @param {HTMLTableElement} table - The table element
     */
    deleteTable(table) {
        this.deselectTable();
        table.remove();
        this.sync();
    }

    /**
     * Handle keyboard shortcuts
     *
     * @param {KeyboardEvent} e - The keyboard event
     * @private
     */
    handleKeyboard(e) {
        if (!this.config.shortcuts) return;

        const isMac = navigator.platform.includes('Mac');
        const modifier = isMac ? e.metaKey : e.ctrlKey;

        if (!modifier) return;

        const shortcuts = {
            'b': 'bold',
            'i': 'italic',
            'u': 'underline'
        };

        const key = e.key.toLowerCase();

        // Handle Ctrl+K for link
        if (key === 'k') {
            e.preventDefault();
            this.insertLink();
            return;
        }

        // Handle Ctrl+Shift+Z for redo
        if (e.shiftKey && key === 'z') {
            e.preventDefault();
            this.exec('redo');
            return;
        }

        if (shortcuts[key]) {
            e.preventDefault();
            this.exec(shortcuts[key]);
        }
    }

    /**
     * Handle paste events
     *
     * @param {ClipboardEvent} e - The paste event
     * @private
     */
    handlePaste(e) {
        if (this.config.pasteAsPlainText) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
            this.sync();
            return;
        }

        // For HTML paste, let default behavior happen but sync after
        setTimeout(() => {
            this.sanitizeContent();
            this.sync();
        }, 0);
    }

    /**
     * Sanitize the editor content (remove dangerous elements)
     * @private
     */
    sanitizeContent() {
        // Remove dangerous elements
        const dangerous = this.editor.querySelectorAll('script, style, link, meta, iframe, object, embed');
        dangerous.forEach(el => el.remove());

        // Remove event handlers from all elements
        this.editor.querySelectorAll('*').forEach(el => {
            [...el.attributes].forEach(attr => {
                if (attr.name.startsWith('on')) {
                    el.removeAttribute(attr.name);
                }
            });
        });
    }

    /**
     * Normalize content - convert div tags to p tags for consistency, and wrap
     * bare text/inline nodes at the editor root into paragraph elements.
     * @private
     */
    normalizeContent() {
        // Wrap bare text nodes and inline elements that sit directly inside the
        // editor root into <p> elements (happens when pasting into an empty editor).
        const blockTags = new Set(['P','DIV','H1','H2','H3','H4','H5','H6','UL','OL','BLOCKQUOTE','PRE','TABLE','FIGURE','HR']);
        let group = [];
        const flushGroup = () => {
            if (!group.length) return;
            // Whitespace-only text (e.g. formatting newlines between pasted
            // block tags) carries no content worth wrapping — leave it as an
            // inert root-level text node instead of turning it into a
            // permanent empty <p>.
            const isWhitespaceOnly = group.every(n => n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
            if (!isWhitespaceOnly) {
                const p = document.createElement('p');
                group[0].before(p);
                group.forEach(n => p.appendChild(n));
            }
            group = [];
        };
        [...this.editor.childNodes].forEach(node => {
            if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !blockTags.has(node.tagName))) {
                group.push(node);
            } else {
                flushGroup();
            }
        });
        flushGroup();

        let changed = true;
        let iterations = 0;
        const maxIterations = 10;

        // Loop until no more changes (handles nested divs)
        while (changed && iterations < maxIterations) {
            changed = false;
            iterations++;

            this.editor.querySelectorAll('div').forEach(div => {
                // Unwrap divs that contain only a single block element
                const blockChild = div.querySelector(':scope > ul, :scope > ol, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > blockquote, :scope > p');
                if (blockChild && div.children.length === 1 && div.textContent.trim() === blockChild.textContent.trim()) {
                    div.replaceWith(blockChild);
                    changed = true;
                    return;
                }

                // Skip contenteditable="false" embeds (e.g. gallery placeholders)
                if (div.getAttribute('contenteditable') === 'false') return;

                // Skip divs that contain nested block elements
                if (div.querySelector('div, p, ul, ol, h1, h2, h3, h4, h5, h6, blockquote')) {
                    return;
                }

                // Convert simple div to p
                const p = document.createElement('p');
                p.innerHTML = div.innerHTML;
                div.replaceWith(p);
                changed = true;
            });
        }
    }

    /**
     * Determine whether a single command/value pair currently matches the
     * selection's state. Shared by individual toolbar buttons and by group
     * membership checks for dropdown triggers (e.g. heading, alignment).
     *
     * @param {string} command
     * @param {string|undefined} value
     * @returns {boolean}
     * @private
     */
    isCommandStateActive(command, value) {
        // Check formatBlock for headings, blockquote, pre
        if (command === 'formatBlock' && value) {
            const currentBlock = document.queryCommandValue('formatBlock');
            return currentBlock.toLowerCase() === value.toLowerCase();
        // DOM-based check for subscript (Firefox queryCommandState unreliable)
        } else if (command === 'subscript') {
            return this.isInsideTag('sub');
        // DOM-based check for superscript (Firefox queryCommandState unreliable)
        } else if (command === 'superscript') {
            return this.isInsideTag('sup');
        // CSS-based check for justifyFull (Safari queryCommandState unreliable)
        } else if (command === 'justifyFull') {
            const block = this.getSelectedBlockElement();
            return !!(block && getComputedStyle(block).textAlign === 'justify');
        }

        try {
            return document.queryCommandState(command);
        } catch (e) {
            // Some commands don't support queryCommandState
            return false;
        }
    }

    /**
     * Update toolbar button active states
     * @private
     */
    updateToolbarState() {
        const buttons = this.toolbar.querySelectorAll('[data-command]');
        const activeClass = `${this.config.classPrefix}-btn-active`;

        buttons.forEach(btn => {
            btn.classList.remove(activeClass);

            const groupKey = btn.dataset.dropdownTrigger;

            if (groupKey === 'fontSize' || groupKey === 'fontName') {
                this.updateFontTriggerLabel(btn, groupKey);
                return;
            }

            const groupDef = groupKey ? StarEditor.toolbarButtons[groupKey] : null;

            if (groupDef && groupDef.groupItems) {
                const isActive = groupDef.groupItems.some(key => {
                    if (groupDef.activeIgnore && groupDef.activeIgnore.includes(key)) return false;
                    const itemDef = StarEditor.toolbarButtons[key];
                    return this.isCommandStateActive(itemDef.command, itemDef.value);
                });
                if (isActive) {
                    btn.classList.add(activeClass);
                }
                return;
            }

            if (this.isCommandStateActive(btn.dataset.command, btn.dataset.value)) {
                btn.classList.add(activeClass);
            }
        });
    }

    /**
     * Refresh a Font Size / Font Family trigger button's value label to reflect
     * the computed style at the current selection, falling back to the editor's
     * own baseline style when the selection isn't inside it.
     *
     * @param {HTMLElement} btn - The dropdown trigger button
     * @param {string} name - 'fontSize' or 'fontName'
     * @private
     */
    updateFontTriggerLabel(btn, name) {
        const label = btn.querySelector(`.${this.config.classPrefix}-btn-label`);
        // The dropdown trigger is built during buildToolbar(), before this.editor exists;
        // init() calls updateToolbarState() again once the editor is live, which re-enters
        // here with a real value.
        if (!label || !this.editor) return;

        let el = this.editor;
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const node = selection.anchorNode;
            if (node && this.editor.contains(node)) {
                el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
                if (!el || !this.editor.contains(el)) {
                    el = this.editor;
                }
            }
        }

        const computed = getComputedStyle(el);

        if (name === 'fontSize') {
            label.textContent = `${Math.round(parseFloat(computed.fontSize))}px`;
        } else {
            const firstFamily = computed.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();
            const match = this.config.fontFamilies.find(font =>
                font.value.split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase() === firstFamily
            );
            label.textContent = match ? match.label : (this.t('toolbar.fontNameDefault') || 'Font');
        }
    }

    /**
     * Get clean HTML content without editor UI elements
     *
     * @returns {string} Clean HTML content
     * @private
     */
    getCleanContent() {
        const prefix = this.config.classPrefix;

        // Clone the editor content
        const clone = this.editor.cloneNode(true);

        // Remove editor UI elements (toolbars, resizers, selection classes)
        clone.querySelectorAll(`.${prefix}-image-toolbar, .${prefix}-image-resizer, .${prefix}-table-toolbar`).forEach(el => el.remove());

        // Remove selection classes from elements
        clone.querySelectorAll(`.${prefix}-image-selected`).forEach(el => el.classList.remove(`${prefix}-image-selected`));
        clone.querySelectorAll(`.${prefix}-table-selected`).forEach(el => el.classList.remove(`${prefix}-table-selected`));

        const cleaned = clone.innerHTML;
        if (typeof this.config.onContentOut === 'function') {
            return this.config.onContentOut(cleaned);
        }
        return cleaned;
    }

    /**
     * Sanitize HTML to remove any embedded editor UI elements
     * This cleans up content that may have been saved with toolbars accidentally
     *
     * @param {string} html - The HTML content to sanitize
     * @returns {string} Sanitized HTML content
     * @private
     */
    sanitizeEditorUI(html) {
        const prefix = this.config.classPrefix;
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove any editor UI elements that were accidentally saved
        temp.querySelectorAll(`.${prefix}-image-toolbar, .${prefix}-image-resizer, .${prefix}-table-toolbar`).forEach(el => el.remove());

        // Remove selection classes
        temp.querySelectorAll(`.${prefix}-image-selected`).forEach(el => el.classList.remove(`${prefix}-image-selected`));
        temp.querySelectorAll(`.${prefix}-table-selected`).forEach(el => el.classList.remove(`${prefix}-table-selected`));

        const sanitized = temp.innerHTML;
        if (typeof this.config.onContentIn === 'function') {
            return this.config.onContentIn(sanitized);
        }
        return sanitized;
    }

    /**
     * Sync editor content to the hidden textarea. In code view the source
     * pane is the only up-to-date copy — the WYSIWYG div is stale until the
     * user switches back — so its value is copied verbatim, without
     * re-parsing or re-normalizing, to avoid silently rewriting whatever
     * HTML the user typed by hand.
     */
    sync() {
        if (this.isCodeView) {
            this.textarea.value = this.codeEditor.value;
            return;
        }
        this.normalizeContent();
        this.textarea.value = this.getCleanContent();
    }

    /**
     * Get the current HTML content. Returns the code view source verbatim
     * while in code view, since the WYSIWYG div is stale until the user
     * switches back.
     *
     * @returns {string} The editor HTML content
     */
    getContent() {
        if (this.isCodeView) {
            return this.codeEditor.value;
        }
        return this.getCleanContent();
    }

    /**
     * Set the editor HTML content. Also refreshes the code view source pane
     * when currently in code view, so it doesn't revert the caller's change
     * on the next toggle back to WYSIWYG.
     *
     * @param {string} html - The HTML content to set
     */
    setContent(html) {
        this.editor.innerHTML = this.sanitizeEditorUI(html);
        if (this.isCodeView) {
            this.codeEditor.value = this.getCleanContent();
        }
        this.sync();
    }

    /**
     * Get the current plain text content. While in code view, the text is
     * extracted from the (unsaved) source pane via an inert DOMParser
     * document — never assigned to a live element — so raw hand-typed HTML
     * can't trigger resource loads just by checking emptiness.
     *
     * @returns {string} The editor plain text content
     */
    getText() {
        if (this.isCodeView) {
            const doc = new DOMParser().parseFromString(this.codeEditor.value, 'text/html');
            return doc.body.textContent || '';
        }
        return this.editor.textContent || this.editor.innerText;
    }

    /**
     * Focus the editor
     */
    focus() {
        this.editor.focus();
    }

    /**
     * Blur the editor
     */
    blur() {
        this.editor.blur();
    }

    /**
     * Check if the editor is empty
     *
     * @returns {boolean} True if the editor is empty
     */
    isEmpty() {
        const text = this.getText().trim();
        return text.length === 0;
    }

    /**
     * Destroy the editor and restore the original textarea
     */
    destroy() {
        // Remove document click handler
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler);
            this.documentClickHandler = null;
        }

        // Deselect any image
        this.deselectImage();

        // Move textarea back and show it
        this.wrapper.parentNode.insertBefore(this.textarea, this.wrapper);
        this.textarea.style.display = '';

        // Remove the wrapper
        this.wrapper.remove();

        // Clear references
        this.wrapper = null;
        this.toolbar = null;
        this.editor = null;
        this.codeEditor = null;
        this.savedSelection = null;
        this.selectedImage = null;
        this.imageToolbar = null;
        this.imageResizer = null;
    }

    /**
     * Escape HTML special characters
     *
     * @param {string} str - The string to escape
     * @returns {string} The escaped string
     * @private
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Factory method to create editor instances
     *
     * @param {string} selector - CSS selector for textarea(s)
     * @param {Object} options - Configuration options
     * @returns {StarEditor|StarEditor[]} Single editor or array of editors
     */
    static init(selector, options = {}) {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
            throw new Error(`No elements found for selector: ${selector}`);
        }

        if (elements.length === 1) {
            return new StarEditor(elements[0], options);
        }

        return Array.from(elements).map(el => new StarEditor(el, options));
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StarEditor;
}
