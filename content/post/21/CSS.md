---
title: 【CSS】Basics
date: 2021-04-17 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- CSS
---


CSS stands for Cascading Style Sheets

## Comment

```css
/* comment */
```

## How to use

* External

```html
<link rel="stylesheet" href="mystyle.css">
```

* Internal

```html
<style>
...
</style>
```

* Inline

```html
<link rel="stylesheet" href="mystyle.css">
```

If some properties have been defined for the same selector (element) in different style sheets, the value from **the last read** style sheet will be used. 

All the styles in a page will "cascade" into a new "virtual" style sheet by the following rules, where number one has the highest priority:

1. Inline style (inside an HTML element)
2. External and internal style sheets (in the head section)
3. Browser default

So, an inline style has the highest priority, and will override external and internal styles and browser defaults.

## Selector

- Simple selectors (select elements based on name, id, class)
- [Combinator selectors](https://www.w3schools.com/css/css_combinators.asp) (select elements based on a specific relationship between them)
- [Pseudo-class selectors](https://www.w3schools.com/css/css_pseudo_classes.asp) (select elements based on a certain state)
- [Pseudo-elements selectors](https://www.w3schools.com/css/css_pseudo_elements.asp) (select and style a part of an element)
- [Attribute selectors](https://www.w3schools.com/css/css_attribute_selectors.asp) (select elements based on an attribute or attribute value)

### Simple Selector

* element selector
* id selector
* class selector

### Combinator Selector

* descendant selector (space) ：matches all elements that are **descendants** of a specified element

```css
div p {
  background-color: yellow;
}
```

* child selector (>) ：selects all elements that are the **children** of a specified element.

```css
div > p {
  background-color: yellow;
}
```

* adjacent sibling selector (+) : select an element that is **directly after** another specific element.:

```css
div + p {
  background-color: yellow;
}
```

* general sibling selector (~) : selects **all** elements that are **next siblings** of a specified element.

```css
div ~ p {
  background-color: yellow;
}
```

### Pseudo-classes Selector

A pseudo-class is used to define a **special state** of an element.

#### syntax

```css
selector:pseudo-class {
  property: value;
}
```

#### Anchor pseudo-classes order

* :link (unvisited)
* :visited
* :hover
* :active (clicked)

#### :first-child

The `:first-child` pseudo-class matches a specified element that is the first child of another element.

```css
p:first-child {
  color: blue;
}

//first i in p
p i:first-child {
  color: blue;
}

//all i in first p
p:first-child i{
    
}
```

#### :lang

The `:lang` pseudo-class allows you to define special rules for different languages.

```vue
<p>Some text <q lang="no">A quote in a paragraph</q> Some text.</p>

<style>
q:lang(no) {
  quotes: "~" "~";
}
</style>
```

#### all pseudo classes

| Selector                                                     | Example               | Example description                                          |
| :----------------------------------------------------------- | :-------------------- | :----------------------------------------------------------- |
| [:active](https://www.w3schools.com/cssref/sel_active.asp)   | a:active              | Selects the active link                                      |
| [:checked](https://www.w3schools.com/cssref/sel_checked.asp) | input:checked         | Selects every checked <input> element                        |
| [:disabled](https://www.w3schools.com/cssref/sel_disabled.asp) | input:disabled        | Selects every disabled <input> element                       |
| [:empty](https://www.w3schools.com/cssref/sel_empty.asp)     | p:empty               | Selects every <p> element that has no children               |
| [:enabled](https://www.w3schools.com/cssref/sel_enabled.asp) | input:enabled         | Selects every enabled <input> element                        |
| [:first-child](https://www.w3schools.com/cssref/sel_firstchild.asp) | p:first-child         | Selects every <p> elements that is the first child of its parent |
| [:first-of-type](https://www.w3schools.com/cssref/sel_first-of-type.asp) | p:first-of-type       | Selects every <p> element that is the first <p> element of its parent |
| [:focus](https://www.w3schools.com/cssref/sel_focus.asp)     | input:focus           | Selects the <input> element that has focus                   |
| [:hover](https://www.w3schools.com/cssref/sel_hover.asp)     | a:hover               | Selects links on mouse over                                  |
| [:in-range](https://www.w3schools.com/cssref/sel_in-range.asp) | input:in-range        | Selects <input> elements with a value within a specified range |
| [:invalid](https://www.w3schools.com/cssref/sel_invalid.asp) | input:invalid         | Selects all <input> elements with an invalid value           |
| [:lang(*language*)](https://www.w3schools.com/cssref/sel_lang.asp) | p:lang(it)            | Selects every <p> element with a lang attribute value starting with "it" |
| [:last-child](https://www.w3schools.com/cssref/sel_last-child.asp) | p:last-child          | Selects every <p> elements that is the last child of its parent |
| [:last-of-type](https://www.w3schools.com/cssref/sel_last-of-type.asp) | p:last-of-type        | Selects every <p> element that is the last <p> element of its parent |
| [:link](https://www.w3schools.com/cssref/sel_link.asp)       | a:link                | Selects all unvisited links                                  |
| [:not(selector)](https://www.w3schools.com/cssref/sel_not.asp) | :not(p)               | Selects every element that is not a <p> element              |
| [:nth-child(n)](https://www.w3schools.com/cssref/sel_nth-child.asp) | p:nth-child(2)        | Selects every <p> element that is the second child of its parent |
| [:nth-last-child(n)](https://www.w3schools.com/cssref/sel_nth-last-child.asp) | p:nth-last-child(2)   | Selects every <p> element that is the second child of its parent, counting from the last child |
| [:nth-last-of-type(n)](https://www.w3schools.com/cssref/sel_nth-last-of-type.asp) | p:nth-last-of-type(2) | Selects every <p> element that is the second <p> element of its parent, counting from the last child |
| [:nth-of-type(n)](https://www.w3schools.com/cssref/sel_nth-of-type.asp) | p:nth-of-type(2)      | Selects every <p> element that is the second <p> element of its parent |
| [:only-of-type](https://www.w3schools.com/cssref/sel_only-of-type.asp) | p:only-of-type        | Selects every <p> element that is the only <p> element of its parent |
| [:only-child](https://www.w3schools.com/cssref/sel_only-child.asp) | p:only-child          | Selects every <p> element that is the only child of its parent |
| [:optional](https://www.w3schools.com/cssref/sel_optional.asp) | input:optional        | Selects <input> elements with no "required" attribute        |
| [:out-of-range](https://www.w3schools.com/cssref/sel_out-of-range.asp) | input:out-of-range    | Selects <input> elements with a value outside a specified range |
| [:read-only](https://www.w3schools.com/cssref/sel_read-only.asp) | input:read-only       | Selects <input> elements with a "readonly" attribute specified |
| [:read-write](https://www.w3schools.com/cssref/sel_read-write.asp) | input:read-write      | Selects <input> elements with no "readonly" attribute        |
| [:required](https://www.w3schools.com/cssref/sel_required.asp) | input:required        | Selects <input> elements with a "required" attribute specified |
| [:root](https://www.w3schools.com/cssref/sel_root.asp)       | root                  | Selects the document's root element                          |
| [:target](https://www.w3schools.com/cssref/sel_target.asp)   | #news:target          | Selects the current active #news element (clicked on a URL containing that anchor name) |
| [:valid](https://www.w3schools.com/cssref/sel_valid.asp)     | input:valid           | Selects all <input> elements with a valid value              |
| [:visited](https://www.w3schools.com/cssref/sel_visited.asp) | a:visited             | Selects all visited links                                    |

### Pseudo-element Selector

A CSS pseudo-element is used to style **specified parts** of an element.

#### syntax

```css
selector::pseudo-element {
  property: value;
}
```

#### ::first-line

**Note:** The `::first-line` pseudo-element can only be applied to **block-level elements**.

The following properties apply to the `::first-line` pseudo-element:

- font properties
- color properties
- background properties
- word-spacing
- letter-spacing
- text-decoration
- vertical-align
- text-transform
- line-height
- clear

#### ::first-letter

**Note:** The `::first-letter` pseudo-element can only be applied to block-level elements.

The following properties apply to the ::first-letter pseudo- element: 

- font properties
- color properties
- background properties
- margin properties
- padding properties
- border properties
- text-decoration
- vertical-align (only if "float" is "none")
- text-transform
- line-height
- float
- clear

#### ::before and ::after

The `::before`  and `::after` pseudo-element can be used to insert some content before the content of an element.

```css
h1::before {
  content: url(smiley.gif);
}
```



#### all pseudo elements

| Selector                                                     | Example         | Example description                                          |
| :----------------------------------------------------------- | :-------------- | :----------------------------------------------------------- |
| [::after](https://www.w3schools.com/cssref/sel_after.asp)    | p::after        | Insert something after the content of each <p> element       |
| [::before](https://www.w3schools.com/cssref/sel_before.asp)  | p::before       | Insert something before the content of each <p> element      |
| [::first-letter](https://www.w3schools.com/cssref/sel_firstletter.asp) | p::first-letter | Selects the first letter of each <p> element                 |
| [::first-line](https://www.w3schools.com/cssref/sel_firstline.asp) | p::first-line   | Selects the first line of each <p> element                   |
| [::marker](https://www.w3schools.com/cssref/sel_marker.asp)  | ::marker        | Selects the markers of list items                            |
| [::selection](https://www.w3schools.com/cssref/sel_selection.asp) | p::selection    | Selects the portion of an element that is **selected by a user** |

### Attribute Selector

#### [attribute] Selector

The `[attribute]` selector is used to select elements with a specified attribute.

```css
a[target] {
  background-color: yellow;
}
```

#### [attribute="value"] Selector （等于）

The `[attribute="value"]` selector is used to select elements with a specified attribute and value.

```css
a[target="_blank"] {
  background-color: yellow;
}
```

#### [attribute~="value"] Selector（限制包含）

The `[attribute~="value"]` selector is used to select elements with an attribute value **containing a specified word.**

```css
[title~="flower"] {
  border: 5px solid yellow;
}
```

The example above will match elements with title="flower", title="summer flower", and title="flower new", but not title="my-flower" or title="flowers".

#### [attribute*="value"] Selector（包含）

The `[attribute*="value"]` selector is used to select elements whose attribute value contains a specified value.

The following example selects all elements with a class attribute value that contains "te":

**Note:** The value does not have to be a whole word! 

```css
[class*="te"] {
  background: yellow;
}
```

#### [attribute|="value"] Selector（限制开始）

The `[attribute|="value"]` selector is used to select elements with the specified attribute, whose value can be exactly the specified value, or the specified value followed by a hyphen (-).

**Note:** The value has to be a whole word, either alone, like class="top", or followed by a hyphen( - ), like class="top-text".

```css
[class|="top"] {
  background: yellow;
}
```

#### [attribute^="value"] Selector（开始）

The `[attribute^="value"]` selector is used to select elements with the specified attribute, whose value starts with the specified value.

The following example selects all elements with a class attribute value that starts with "top":

**Note:** The value does not have to be a whole word!

```css
[class^="test"] {
  background: yellow;
}
```

#### [attribute$="value"] Selector（结束）

The `[attribute$="value"]` selector is used to select elements whose attribute value ends with a specified value.

The following example selects all elements with a class attribute value that ends with "test":

**Note:** The value does not have to be a whole word! 

```css
[class$="test"] {
  background: yellow;
}
```

### Special Selector

#### Universal Selector

The universal selector (*) selects all HTML elements on the page.

#### Grouping Selector

The universal selector (*) selects all HTML elements on the page.

```css
h1, h2, p {
  text-align: center;
  color: red;
}
```

### Specificity

If there are two or more CSS rules that point to the same element, the selector with the highest specificity value will "win", and its style declaration will be applied to that HTML element.

Every CSS selector has its place in the specificity hierarchy.

There are four categories which define the specificity level of a selector:

- **Inline styles** (1000)- Example: <h1 style="color: pink;">
- **IDs** (100) - Example: #navbar
- **Classes, pseudo-classes, attribute selectors** (10) - Example: .test, :hover, [href]
- **Elements and pseudo-elements** (1 ) - Example: h1, ::before

> **Equal specificity: the latest rule wins**
>
> **The universal selector (\*) and inherited values have a specificity of 0** - The universal selector (*) and inherited values are ignored!

#### ！important

if you use the `!important` rule, it will override ALL previous styling rules for that specific property on that element!

```css
#myid {
  background-color: blue;
}

.myclass {
  background-color: gray;
}

p {
  background-color: red !important;
}
```

The only way to override an `!important` rule is to include another `!important` rule on a declaration with the same (or higher) specificity in the source code - and here the problem starts! This makes the CSS code confusing and the debugging will be hard, especially if you have a large style sheet!

> do not use it unless you absolutely have to.

## Colors

### type

* **background color**
  * `background-color`
  * `background`

* **text color**
  * `color`
* **border color**
  * `border`

### value

#### RGB

**rgb(red,green, blue)**

Each parameter (red, green, and blue) defines the intensity of the color between 0 and 255.

##### RGBA

**rgba(red,green,blue, alpha)**

The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (not transparent at all)

#### HEX

A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue) hexadecimal integers specify the components of the color.

In CSS, a color can be specified using a hexadecimal value in the form:

**#rrggbb**

Where rr (red), gg (green) and bb (blue) are hexadecimal values between 00 and ff (same as decimal 0-255).

#### HSL

In CSS, a color can be specified using hue, saturation, and lightness (HSL) in the form:

**hsl(*hue*, *saturation*, *lightness*)**

Hue is a degree on the color wheel from 0 to 360. 0 is red, 120 is green, and 240 is blue.

Saturation is a percentage value, 0% means a shade of gray, and 100% is the full color.

Lightness is also a percentage, 0% is black, 50% is neither light or dark, 100% is white

##### HSLA

**hsla(*hue,* *saturation*, *lightness, alpha*)**

The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (not transparent at all)

### Keyword

* `transparent`

equal to rgba(0,0,0,0)

* **`currentcolor`**

 is like a variable that holds the current value of the color property of an element.

### Opacity

The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (not transparent at all)

### Gradients

CSS defines three types of gradients:

- **Linear Gradients (goes down/up/left/right/diagonally)**

> background-image: (repeating)-linear-gradient(*direction*/angle, *color-stop1*, *color-stop2, ...*);

- **Radial Gradients (defined by their center)**

> background-image: (repeating)-radial-gradient(*shape size* at *position, start-color, ..., last-color*);

- **Conic Gradients (rotated around a center point)**

> background-image: (repeating)-radial-gradient(*shape size* at *position, start-color, ..., last-color*);

## Background

### `background-color`

explained before

### `background-image`

By default, the image is repeated so it covers the entire element.

```css
body {
  background-image: url("paper.gif");
}
```

#### `background-repeat`

By default, the `background-image` property repeats an image both horizontally and vertically.

```css
body {
  background-image: url("gradient_bg.png");
  background-repeat: repeat(default) | repeat-x | repeat-y | no-repeat | space | round | initial | inherit;
}
```

#### `background-position`

The `background-position` property is used to specify the position of the background image.

#### `background-attachment`

The `background-attachment` property specifies whether the background image should scroll or be fixed (will not scroll with the rest of the page)

### `background`

shorthand property for above properties



## Box Model

![CSS box-model](https://www.runoob.com/images/box-model.gif)

Explanation of the different parts:

- **Content** - The content of the box, where text and images appear
- **Padding** - Clears an area around the content. The padding is **transparent**
- **Border** - A border that goes around the padding and content
- **Margin** - Clears an area outside the border. The margin is **transparent**

## Padding

Padding is used to create space around an element's content, inside of any defined borders.

CSS has properties for specifying the padding for each side of an element:

- `padding-top`
- `padding-right`
- `padding-bottom`
- `padding-left`
- `padding`(shorthand)

All the padding properties can have the following values:

- *length* - specifies a padding in px, pt, cm, etc.
- *%* - specifies a padding in % of the width of the containing element
- inherit - specifies that the padding should be inherited from the parent element

**Note:** Negative values are **not allowed.**

If the `padding` property has three values:

- padding: 25px 50px 75px;
  - top padding is 25px
  - right and left paddings are 50px
  - bottom padding is 75px

## Border

The CSS border properties allow you to specify the style, width, and color of an element's border.

* `border-style`
* `border-width`

The width can be set as a specific size (in px, pt, cm, em, etc) or by using one of the three pre-defined values: thin, medium, or thick

The `border-width` property can have from one to four values (for the top border, right border, bottom border, and the left border)

* `border-color`
* `border`(shorthand)

the `border-style` is required

* `border-image`

you can set an image to be used as the border around an element.

> **Tip:** The `border-image` property is actually a shorthand property for the `border-image-source`, `border-image-slice`, `border-image-width`, `border-image-outset` and `border-image-repeat` properties.

### Side-Specific

`border-(side)-(value)`

### Rounded

With the CSS `border-radius` property, you can give any element "rounded corners".

> **Tip:** The `border-radius` property is actually a shorthand property for the `border-top-left-radius`, `border-top-right-radius`, `border-bottom-right-radius` and `border-bottom-left-radius` properties

## Margins

Margins are used to create space around elements, **outside** of any defined borders.

* `margin-top`
* `margin-right`
* `margin-bottom`
* `margin-left`
* `margin` (shorthand)

All the margin properties can have the following values:

- auto - the browser calculates the margin
- *length* - specifies a margin in px, pt, cm, etc.
- *%* - specifies a margin in % of the width of the containing element
- inherit - specifies that the margin should be inherited from the parent element

**Tip:** Negative values are allowed.

If the `margin` property has three values:

- margin: 25px 50px 75px;
  - top margin is 25px
  - right and left margins are 50px
  - bottom margin is 75px

### Margin Collapse

**Top and bottom** margins of elements are sometimes collapsed into a single margin that is equal to the **largest** of the two margins.

This does not happen on left and right margins! Only top and bottom margins!

## Width/Height

The `height` and `width` properties are used to set the height and width of an element.

The height and width properties do not include padding, borders, or margins. It sets the height/width of the area inside the padding, border, and margin of the element.

The `height` and `width` properties may have the following values:

- `auto` - This is default. The browser calculates the height and width
- `length` - Defines the height/width in px, cm etc.
- `%` - Defines the height/width in percent of the containing block
- `initial` - Sets the height/width to its default value
- `inherit` - The height/width will be inherited from its parent value

we can also use `min/max-width/height` to achieve our goal.

### Box Sizing

The CSS `box-sizing` property allows us to include the padding and border in an element's total width and height.

By default, the width and height of an element is calculated like this:

width + padding + border = actual width of an element
height + padding + border = actual height of an element

This means: When you set the width/height of an element, the element often appears **bigger** than you have set 

If you set `box-sizing: border-box;` on an element, padding and border are included in the width and height

## Outline

An outline is a line drawn outside the element's border.

CSS has the following outline properties:

- `outline-style`
- `outline-color`
- `outline-width`
- `outline-offset`
- `outline`

> **Note:** Outline differs from [borders](https://www.w3schools.com/css/css_border.asp)! Unlike border, the outline is drawn outside the element's border, and may overlap other content. Also, the outline is NOT a part of the element's dimensions; the element's total width and height is not affected by the width of the outline.

## Text

### Text Color

The `color` property is used to set the color of the text.

###  Text Alignment

- `text-align  `

set the **horizontal** alignment of a text. 

When the `text-align` property is set to "justify", each line is stretched so that every line has equal width, and the left and right margins are straight (like in magazines and newspapers)

- `text-align-last`

The `text-align-last` property specifies how to align the last line of a text.

- `direction`
- `unicode-bidi`

The `direction` and `unicode-bidi` properties can be used to change the text direction of an element

- `vertical-align`

`vertical-align` property sets the vertical alignment of an element.

### Text Decoration

- `text-decoration-line`
- `text-decoration-color`
- `text-decoration-style`
- `text-decoration-thickness`
- `text-decoration`

### Text Transformation

The `text-transform` property is used to specify uppercase and lowercase letters in a text.

`text-transform: none|capitalize|uppercase|lowercase|initial|inherit;`

### Text Spacing

- `text-indent`

specify the indentation of the first line of a text

- `letter-spacing`
- `line-height`
- `word-spacing`
- `white-space`

### Text Shadow

horizontal shadow ;vertical shadow ;blur effect;colors

```css
h1 {
  color: white;
  text-shadow: 2px 2px 4px #000000;
}
```

### Text Effect

- `text-overflow`

specifies how overflowed content that is not displayed should be signaled to the user.

- `word-wrap`

allows long words to be able to be broken and wrap onto the next line.

- **`word-break`**

 specifies line breaking rules.

- `writing-mode`

specifies whether lines of text are laid out horizontally or vertically.

## Font

### Font Family

In CSS there are five generic font families:

1. **Serif** fonts have a small stroke at the edges of each letter. They create a sense of formality and elegance.
2. **Sans-serif** fonts have clean lines (no small strokes attached). They create a modern and minimalistic look.
3. **Monospace** fonts - here all the letters have the same fixed width. They create a mechanical look.
4. **Cursive** fonts imitate human handwriting.
5. **Fantasy** fonts are decorative/playful fonts.

**Note**: If the font name is more than one word, it must be in quotation marks, like: "Times New Roman".

> **Tip:** The `font-family` property should hold several font names as a "**fallback**" system, to ensure maximum compatibility between browsers/operating systems. Start with the font you want, and end with a generic family (to let the browser pick a similar font in the generic family, if no other fonts are available). The font names should be separated with comma. 

The following list are the best web safe fonts for HTML and CSS:

- Arial (sans-serif)
- Verdana (sans-serif)
- Helvetica (sans-serif)
- Tahoma (sans-serif)
- Trebuchet MS (sans-serif)
- Times New Roman (serif)
- Georgia (serif)
- Garamond (serif)
- Courier New (monospace)
- Brush Script MT (cursive)

### Font Style

`font-style`  property is mostly used to specify italic text.

This property has three values:

- normal - The text is shown normally
- italic - The text is shown in italics
- oblique - The text is "leaning" (oblique is very similar to italic, but less supported)

`font-weight` specifies the weight of a font ( normal bold)

`font-variant` property specifies whether or not a text should be displayed in a small-caps font.( In a small-caps font, all lowercase letters are converted to uppercase letters. However, the converted uppercase letters appears in a smaller font size than the original uppercase letters in the text. )

### Font Size

The font-size value can be an absolute, or relative size.

Absolute size:

- Sets the text to a specified size
- Does not allow a user to change the text size in all browsers (bad for accessibility reasons)
- Absolute size is useful when the physical size of the output is known

Relative size:

- Sets the size relative to surrounding elements
- Allows a user to change the text size in browsers

**Note:** If you do not specify a font size, the default size for normal text, like paragraphs, is 16px (16px=1em).

1em is equal to the current font size. The default text size in browsers is 16px. So, the default size of 1em is 16px.

with the em size, it is possible to adjust the text size in all browsers.

The solution that works in all browsers, is to set a default font-size in percent for the <body> element:

```css
body {
 font-size: 100%;
}

h1 {
 font-size: 2.5em;
}

h2 {
 font-size: 1.875em;
}

p {
 font-size: 0.875em;
}
```

### `font`

The `font` property is a shorthand property for:

- `font-style`
- `font-variant`
- `font-weight`
- `font-size/line-height`
- `font-family`

**Note:** The `font-size` and `font-family` values are required. If one of the other values is missing, their default value are used.

### Google Fonts

If you do not want to use any of the standard fonts in HTML, you can use Google Fonts.

Google Fonts are free to use, and have more than 1000 fonts to choose from.

Just add a special style sheet link in the <head> section and then refer to the font in the CSS.

```css
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia|Audiowide|Sofia|Trirong">
```

Google have also enabled different font effects that you can use.

First add `effect=effectname` to the Google API, then add a special class name to the element that is going to use the special effect. The class name always starts with `font-effect-` and ends with the `effectname`.

```css
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia&effect=fire">
<h1 class="font-effect-fire">Sofia on Fire</h1>
```

### Web Fonts

Web fonts allow Web designers to use fonts that are not installed on the user's computer.

When you have found/bought the font you wish to use, just include the font file on your web server, and it will be automatically downloaded to the user when needed.

Your "own" fonts are defined within the CSS `@font-face` rule.

```css
@font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
}

div {
  font-family: myFirstFont;
}
```



## Lists

* `list-style-type`
* `list-style-image``
* ``list-style-position`
* `list-style`  ( shorthand )

## Layout

### Display

The `display` property is the most important CSS property for controlling layout.

Every HTML element has a default display value depending on what type of element it is. The default display value for most elements is `block` or `inline`.

`display: none;` is commonly used with JavaScript to hide and show elements without deleting and recreating them.

`visibility:hidden;` also hides an element.

However, the element will still take up the same space as before. The element will be hidden, but still affect the layout

| Value              | Description                                                  | Play it                                                      |
| :----------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| inline             | Displays an element as an inline element (like <span>). Any height and width properties will have no effect | [Demo ❯](https://www.w3schools.com/cssref/playdemo.asp?filename=playcss_display&preval=inline) |
| block              | Displays an element as a block element (like <p>). It starts on a new line, and takes up the whole width | [Demo ❯](https://www.w3schools.com/cssref/playdemo.asp?filename=playcss_display&preval=block) |
| contents           | Makes the container disappear, making the child elements children of the element the next level up in the DOM |                                                              |
| flex               | Displays an element as a **block-level flex container**      |                                                              |
| grid               | Displays an element as a **block-level grid container**      |                                                              |
| inline-block       | Displays an element as an inline-level block container. The element itself is formatted as an inline element, but you **can apply height and width values** |                                                              |
| inline-flex        | Displays an element as an inline-level flex container        |                                                              |
| inline-grid        | Displays an element as an inline-level grid container        |                                                              |
| inline-table       | The element is displayed as an inline-level table            |                                                              |
| list-item          | Let the element behave like a <li> element                   | [Demo ❯](https://www.w3schools.com/cssref/playdemo.asp?filename=playcss_display&preval=list-item) |
| run-in             | Displays an element as either block or inline, depending on context |                                                              |
| table              | Let the element behave like a <table> element                |                                                              |
| table-caption      | Let the element behave like a <caption> element              |                                                              |
| table-column-group | Let the element behave like a <colgroup> element             |                                                              |
| table-header-group | Let the element behave like a <thead> element                |                                                              |
| table-footer-group | Let the element behave like a <tfoot> element                |                                                              |
| table-row-group    | Let the element behave like a <tbody> element                |                                                              |
| table-cell         | Let the element behave like a <td> element                   |                                                              |
| table-column       | Let the element behave like a <col> element                  |                                                              |
| table-row          | Let the element behave like a <tr> element                   |                                                              |
| none               | The element is completely removed                            |                                                              |
| initial            | Sets this property to its default value. [Read about *initial*](https://www.w3schools.com/cssref/css_initial.asp) |                                                              |
| inherit            | Inherits this property from its parent element. [Read about *inherit*](https://www.w3schools.com/cssref/css_inherit.asp) |                                                              |

#### `display:inline-block`

Compared to `display: inline`, the major difference is that `display: inline-block` allows to set a width and height on the element.

Also, with `display: inline-block`, the top and bottom margins/paddings are respected, but with `display: inline` they are not.

Compared to `display: block`, the major difference is that `display: inline-block` does not add a line-break after the element, so the element can sit next to other elements.

### Position

The `position` property specifies the type of positioning method used for an element.

There are five different position values:

- `static`

HTML elements are positioned static by default.

An element with `position: static;` is not positioned in any special way; it is always positioned according to the normal flow of the page

- `relative`

An element with `position: relative;` is positioned relative to its normal position.

Setting the **top, right, bottom, and left** properties of a relatively-positioned element will cause it to be adjusted away from its normal position. Other content **will not be adjusted** to fit into any gap left by the element.

- `fixed`

An element with `position: fixed;` is positioned **relative to the viewport**, which means it always stays in the same place even if the page is scrolled. The top, right, bottom, and left properties are used to position the element.

- `absolute`

An element with `position: absolute;` is positioned relative to the nearest positioned ancestor (instead of positioned relative to the viewport, like fixed).

However; if an absolute positioned element has no positioned ancestors, it uses the document body, and moves along with page scrolling.

- `sticky`

A sticky element toggles between `relative` and `fixed`, depending on the scroll position. It is positioned relative until a given offset position is met in the viewport - then it "sticks" in place (like position:fixed).

### Z-index

specifies the stack order of an element.

 `z-index` **only works** on [positioned elements](https://www.w3schools.com/css/css_positioning.asp) (position: absolute, position: relative, position: fixed, or position: sticky) and [flex items](https://www.w3schools.com/css/css3_flexbox.asp) (elements that are direct children of display: flex elements).

### Overflow

controls what happens to content that is too big to fit into an area, specifies whether to clip the content or to add scrollbars when the content of an element is too big to fit in the specified area.

- `visible` - Default. The overflow is not clipped. The content renders outside the element's box
- `hidden` - The overflow is clipped, and the rest of the content will be invisible
- `scroll` - The overflow is clipped, and a scrollbar is added to see the rest of the content
- `auto` - Similar to `scroll`, but it adds scrollbars only when necessary

The `overflow-x` and `overflow-y` properties specifies whether to change the overflow of content just horizontally or vertically (or both):

### Float and Clear

#### `float`

The CSS `float` property specifies how an element should float.

The CSS `clear` property specifies what elements can float beside the cleared element and on which side.

The `float` property can have one of the following values:

- `left` - The element floats to the left of its container
- `right` - The element floats to the right of its container
- `none` - The element does not float (will be displayed just where it occurs in the text). This is default
- `inherit` - The element inherits the float value of its parent

#### `clear`

When we use the `float` property, and we want the next element below (not on right or left), we will have to use the `clear` property.

The `clear` property specifies what should happen with the element that is next to a floating element.

The `clear` property can have one of the following values:

- `none` - The element is not pushed below left or right floated elements. This is default
- `left` - The element is pushed below left floated elements
- `right` - The element is pushed below right floated elements
- `both` - The element is pushed below both left and right floated elements
- `inherit` - The element inherits the clear value from its parent

When clearing floats, you should **match** the clear to the float: If an element is floated to the left, then you should clear to the left. Your floated element will continue to float, but the cleared element will appear below it on the web page.

If a floated element is taller than the containing element, it will "overflow" outside of its container. We can then add a clearfix hack to solve this problem

### Align

#### Horizontally

To horizontally center a block element (like <div>), use `margin: auto;`

**Note:** Center aligning has no effect if the `width` property is not set (or set to 100%).

To just center the text inside an element, use `text-align: center;`

#### Vertically

* There are many ways to center an element vertically in CSS. A simple solution is to use top and bottom `padding`

* Another trick is to use the `line-height` property with a value that is equal to the `height` property
* another solution is to use positioning and the `transform` property

```css
.center { 
  height: 200px;
  position: relative;
  border: 3px solid green; 
}

.center p {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
```

* You can also use flexbox to center things. Just note that flexbox is not supported in IE10 and earlier versions

## Flex

The Flexible Box Layout Module, makes it easier to design flexible responsive layout structure without using float or positioning.

### container

The flex container becomes flexible by setting the `display` property to `flex`.

The flex container properties are:

- [`flex-direction`](https://www.w3schools.com/css/css3_flexbox_container.asp#flex-direction)

defines in which direction the container wants to stack the flex items.

`column | column-reverse | row | row-reverse `

- [`flex-wrap`](https://www.w3schools.com/css/css3_flexbox_container.asp#flex-wrap)

specifies whether the flex items should wrap or not.

`nowrap(default) | wrap |wrap-reverse`

- [`flex-flow`](https://www.w3schools.com/css/css3_flexbox_container.asp#flex-flow)

shorthand for `flex-direction` and `flex-wrap`

- [`justify-content`](https://www.w3schools.com/css/css3_flexbox_container.asp#justify-content)
  * `flex-start`
  * `center`
  * `flex-end`
  * `space-around` :displays the flex items with space before, between, and after the lines
  * `space-between`：displays the flex items with space between the lines
  * `space-evenly`:equal space around them

- [`align-items`](https://www.w3schools.com/css/css3_flexbox_container.asp#align-items) :used to align the flex items.
  * `flex-start`
  * `flex-end`
  * `center`
  * `stretch `: Items are stretched to fit the container
  * `baseline`:  Items are positioned at the baseline of the container

- [`align-content`](https://www.w3schools.com/css/css3_flexbox_container.asp#align-content): but instead of aligning flex items, it aligns flex lines

### item

The flex item properties are:

- [`order`](https://www.w3schools.com/css/css3_flexbox_items.asp#order)

specifies the appearance order of the flex items.

The first flex item in the code does not have to appear as the first item in the layout.

The order value must be a number, default value is 0.

- [`flex-grow`](https://www.w3schools.com/css/css3_flexbox_items.asp#flex-grow)

The `flex-grow` property specifies how much a flex item will grow relative to the rest of the flex items.

- [`flex-shrink`](https://www.w3schools.com/css/css3_flexbox_items.asp#flex-shrink)

The `flex-grow` property specifies how much a flex item will shrink relative to the rest of the flex items.

- [`flex-basis`](https://www.w3schools.com/css/css3_flexbox_items.asp#flex-basis)

specifies the initial length of a flex item.

- [`flex`](https://www.w3schools.com/css/css3_flexbox_items.asp#flex)

shorthand property for the `flex-grow`, `flex-shrink`, and `flex-basis` properties.

- [`align-self`](https://www.w3schools.com/css/css3_flexbox_items.asp#align-self)

specifies the alignment for the selected item inside the flexible container.

## Grid

### container

* `grid-template-columns`
* `grid-template-rows`
* `justify-content`
* `align-content`

### item

By default, a container has one grid item for each column, in each row, but you can style the grid items so that they will span multiple columns and/or rows.

* `grid-column`

shorthand property for the `grid-column-start` and the `grid-column-end` properties., defines on which column(s) to place an item.

```css
.item1 {
  grid-column: 1 / 5;
}

.item1 {
  grid-column: 1 / span 3;
}
```

* `grid-row`

* `gird-area` : shorthand for the above two properties

```css
.item8 {
  grid-area: 1 / 2 / 5 / 6;
}

.item8 {
  grid-area: 1 / 2 / 5 / 6;
}
```



## Units

CSS has several different units for expressing a length.

> **Note:** A whitespace cannot appear between the number and the unit. However, if the value is `0`, the unit can be omitted.

There are two types of length units: **absolute** and **relative**.

### Absolute

Absolute length units are not recommended for use on screen, because screen sizes vary so much. However, they can be used if the output medium is known, such as for print layout.

Absolute length units are not recommended for use on screen, because screen sizes vary so much. However, they can be used if the output medium is known, such as for print layout.

| Unit | Description                                                  |
| :--- | :----------------------------------------------------------- |
| cm   | centimeters[Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_cm) |
| mm   | millimeters[Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_mm) |
| in   | inches (1in = 96px = 2.54cm)[Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_in) |
| px * | pixels (1px = 1/96th of 1in)[Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_px) |
| pt   | points (1pt = 1/72 of 1in)[Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_pt) |
| pc   | picas (1pc = 12 pt)                                          |

\* Pixels (px) are relative to the viewing device. For low-dpi devices, 1px is one device pixel (dot) of the display. For printers and high resolution screens 1px implies multiple device pixels.

### Relative

Relative length units specify a length relative to another length property. Relative length units scales better between different rendering mediums.

| Unit | Description                                                  |                                                              |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| em   | Relative to the font-size of the element (2em means 2 times the size of the current font) | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_em) |
| ex   | Relative to the x-height of the current font (rarely used)   | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_ex) |
| ch   | Relative to width of the "0" (zero)                          | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_ch) |
| rem  | Relative to font-size of the root element                    | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_rem) |
| vw   | Relative to 1% of the width of the viewport*                 | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_vw) |
| vh   | Relative to 1% of the height of the viewport*                | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_vh) |
| vmin | Relative to 1% of viewport's* smaller dimension              | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_vmin) |
| vmax | Relative to 1% of viewport's* larger dimension               | [Try it](https://www.w3schools.com/css/tryit.asp?filename=trycss_unit_vmax) |
| %    | Relative to the parent element                               |                                                              |

## Math Functions

### calc()

> calc(*expression*)

```css
{
    width: calc(100% - 100px);
}
```

### max()

> max(*value1*, *value2*, ...)

```css
{
    width: max(50%, 300px);
}
```

### min()

> max(*value1*, *value2*, ...)

```css
{
    width: min(50%, 300px);
}
```

## Transforms

### 2D

With the CSS `transform` property you can use the following 2D transformation methods:

- `translate()`

moves an element from its current position (according to the parameters given for the X-axis and the Y-axis).

- **`rotate()`**

 rotates an element clockwise(positive deg) or counter-clockwise (negative deg) according to a given degree.

- `scaleX()`

increases or decreases the width of an element.

- `scaleY()`

increases or decreases the height of an element.

- `scale()`

increases or decreases the size of an element (according to the parameters given for the width and height).

- `skewX()`

skews an element along the X-axis by the given angle.

- `skewY()`

skews an element along the Y-axis by the given angle.

- `skew()`

skews an element along the X and Y-axis by the given angles.

- `matrix()`

combines all the 2D transform methods into one.

> matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())

### 3D

CSS also supports 3D transformations.

| Function                                     | Description                                                  |
| :------------------------------------------- | :----------------------------------------------------------- |
| matrix3d (*n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n*) | Defines a 3D transformation, using a 4x4 matrix of 16 values |
| translate3d(*x,y,z*)                         | Defines a 3D translation                                     |
| translateX(*x*)                              | Defines a 3D translation, using only the value for the X-axis |
| translateY(*y*)                              | Defines a 3D translation, using only the value for the Y-axis |
| translateZ(*z*)                              | Defines a 3D translation, using only the value for the Z-axis |
| scale3d(*x,y,z*)                             | Defines a 3D scale transformation                            |
| scaleX(*x*)                                  | Defines a 3D scale transformation by giving a value for the X-axis |
| scaleY(*y*)                                  | Defines a 3D scale transformation by giving a value for the Y-axis |
| scaleZ(*z*)                                  | Defines a 3D scale transformation by giving a value for the Z-axis |
| rotate3d(*x,y,z,angle*)                      | Defines a 3D rotation                                        |
| rotateX(*angle*)                             | Defines a 3D rotation along the X-axis                       |
| rotateY(*angle*)                             | Defines a 3D rotation along the Y-axis                       |
| rotateZ(*angle*)                             | Defines a 3D rotation along the Z-axis                       |
| perspective(*n*)                             | Defines a perspective view for a 3D transformed element      |

## Transitions

- `transition`
- `transition-delay`

specifies a delay (in seconds) for the transition effect.

- `transition-duration`
- `transition-property`
- `transition-timing-function`

To create a transition effect, you must specify two things:

- the CSS property you want to add an effect to
- the duration of the effect

> **Note:** If the duration part is not specified, the transition will have no effect, because the default value is 0.

```css
div {
  transition: width 2s, height 4s;
}
div:hover {
  width: 300px;
}


/*Several Property Values*/
div:hover {
  width: 300px;
}
```

### Timing Function

The `transition-timing-function` property specifies the speed curve of the transition effect.

The transition-timing-function property can have the following values:

- `ease` - specifies a transition effect with a slow start, then fast, then end slowly (this is default)
- `linear` - specifies a transition effect with the same speed from start to end
- `ease-in` - specifies a transition effect with a slow start
- `ease-out` - specifies a transition effect with a slow end
- `ease-in-out` - specifies a transition effect with a slow start and end
- `cubic-bezier(n,n,n,n)` - lets you define your own values in a cubic-bezier function

## Animations

- `@keyframes`

To use CSS animation, you must first specify some keyframes for the animation.

Keyframes hold what styles the element will have at certain times.

- `animation-name`
- `animation-duration`

The `animation-duration` property defines how long an animation should take to complete. If the `animation-duration` property is not specified, no animation will occur, because the default value is 0s (0 seconds). 

- `animation-delay`

Negative values are also allowed. If using negative values, the animation will start as if it had already been playing for *N* seconds.

- `animation-iteration-count`
- **`animation-direction`**
  * `normal` - The animation is played as normal (forwards). This is default
  * `reverse` - The animation is played in reverse direction (backwards)
  * `alternate `- The animation is played forwards first, then backwards
  * `alternate-reverse` - The animation is played backwards first, then forwards

- `animation-timing-function`
- **`animation-fill-mode`**
  * `none` - Default value. Animation will not apply any styles to the element before or after it is executing
  * `forwards` - The element will retain the style values that is set by the last keyframe (depends on animation-direction and animation-iteration-count)
  * `backwards` - The element will get the style values that is set by the first keyframe (depends on animation-direction), and retain this during the animation-delay period
  * `both` - The animation will follow the rules for both forwards and backwards, extending the animation properties in both directions

CSS animations do not affect an element before the first keyframe is played or after the last keyframe is played. The animation-fill-mode property can override this behavior.

- `animation`

## Media Queries

The `@media` rule, introduced in CSS2, made it possible to define different style rules for different media types.

Unfortunately these media types never got a lot of support by devices, other than the print media type.

Media queries in CSS3 extended the CSS2 media types idea: Instead of looking for a type of device, they look at the capability of the device.

- width and height of the viewport
- width and height of the device
- orientation (is the tablet/phone in landscape or portrait mode?)
- resolution

A media query consists of a media type and can contain one or more expressions, which resolve to either true or false.

```css
@media not|only mediatype and (mediafeature and|or|not mediafeature) {
 CSS-Code;
}
```

### Media Types

| Value  | Description                                           |
| :----- | :---------------------------------------------------- |
| all    | Default. Used for all media type devices              |
| print  | Used for printers                                     |
| screen | Used for computer screens, tablets, smart-phones etc. |
| speech | Used for screenreaders that "reads" the page out loud |

### Media Features

| Value            | Description                                                  |
| :--------------- | :----------------------------------------------------------- |
| any-hover        | Does any available input mechanism allow the user to hover over elements? (added in Media Queries Level 4) |
| any-pointer      | Is any available input mechanism a pointing device, and if so, how accurate is it? (added in Media Queries Level 4) |
| aspect-ratio     | The ratio between the width and the height of the viewport   |
| color            | The number of bits per color component for the output device |
| color-gamut      | The approximate range of colors that are supported by the user agent and output device (added in Media Queries Level 4) |
| color-index      | The number of colors the device can display                  |
| grid             | Whether the device is a grid or bitmap                       |
| height           | The viewport height                                          |
| hover            | Does the primary input mechanism allow the user to hover over elements? (added in Media Queries Level 4) |
| inverted-colors  | Is the browser or underlying OS inverting colors? (added in Media Queries Level 4) |
| light-level      | Current ambient light level (added in Media Queries Level 4) |
| max-aspect-ratio | The maximum ratio between the width and the height of the display area |
| max-color        | The maximum number of bits per color component for the output device |
| max-color-index  | The maximum number of colors the device can display          |
| max-height       | The maximum height of the display area, such as a browser window |
| max-monochrome   | The maximum number of bits per "color" on a monochrome (greyscale) device |
| max-resolution   | The maximum resolution of the device, using dpi or dpcm      |
| max-width        | The maximum width of the display area, such as a browser window |
| min-aspect-ratio | The minimum ratio between the width and the height of the display area |
| min-color        | The minimum number of bits per color component for the output device |
| min-color-index  | The minimum number of colors the device can display          |
| min-height       | The minimum height of the display area, such as a browser window |
| min-monochrome   | The minimum number of bits per "color" on a monochrome (greyscale) device |
| min-resolution   | The minimum resolution of the device, using dpi or dpcm      |
| min-width        | The minimum width of the display area, such as a browser window |
| monochrome       | The number of bits per "color" on a monochrome (greyscale) device |
| orientation      | The orientation of the viewport (landscape or portrait mode) |
| overflow-block   | How does the output device handle content that overflows the viewport along the block axis (added in Media Queries Level 4) |
| overflow-inline  | Can content that overflows the viewport along the inline axis be scrolled (added in Media Queries Level 4) |
| pointer          | Is the primary input mechanism a pointing device, and if so, how accurate is it? (added in Media Queries Level 4) |
| resolution       | The resolution of the output device, using dpi or dpcm       |
| scan             | The scanning process of the output device                    |
| scripting        | Is scripting (e.g. JavaScript) available? (added in Media Queries Level 4) |
| update           | How quickly can the output device modify the appearance of the content (added in Media Queries Level 4) |
| width            | The viewport width                                           |

e.g.

```css
/* changes the background-color to lightgreen if the viewport is 480 pixels wide or wider */
@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
  }
}
```



## Variables

The `var()` function is used to insert the value of a CSS variable.

CSS variables have access to the DOM, which means that you can create variables with local or global scope, change the variables with JavaScript, and change the variables based on media queries.

A good way to use CSS variables is when it comes to the **colors** of your design. Instead of copy and paste the same colors over and over again, you can place them in variables.

> var(--*name, value*)

| *name*  | Required. The variable name (must start with two dashes)     |
| ------- | ------------------------------------------------------------ |
| *value* | Optional. The fallback value (used if the variable is not found) |

### global and local

CSS variables can have a global or local scope.

Global variables can be accessed/used through the entire document, while local variables can be used only inside the selector where it is declared.

To create a variable with global scope, declare it inside the `:root` selector. The `:root` selector matches the document's root element.

To create a variable with local scope, declare it inside the selector that is going to use it.

```css
:root {
  --blue: #1e90ff;
  --white: #ffffff;
}

body { background-color: var(--blue); }

h2 { border-bottom: 2px solid var(--blue); }

.container {
  color: var(--blue);
  background-color: var(--white);
  padding: 15px;
}

button {
  background-color: var(--white);
  color: var(--blue);
  border: 1px solid var(--blue);
  padding: 5px;
}
```

### override

we can re-declare the --blue variable inside a specific selector. When we use var(--blue) inside this selector, it will use the local variable redeclared within it.

### with javascript

CSS variables have access to the DOM, which means that you can change them with JavaScript.

## Responsive

### Viewport

HTML5 introduced a method to let web designers take control over the viewport, through the `<meta>` tag.

You should include the following `<meta>` viewport element in all your web pages:

<meta name="viewport" content="width=device-width, initial-scale=1.0">

This gives the browser instructions on how to control the page's dimensions and scaling.

The `width=device-width` part sets the width of the page to follow the screen-width of the device (which will vary depending on the device).

The `initial-scale=1.0` part sets the initial zoom level when the page is first loaded by the browser.

### Media Queries

Media Queries are about defining different style rules for different devices (screens, tablets, mobile phones, etc.)

## Others

### `object-fit`

The CSS `object-fit` property is used to specify how an <img> or <video> should be resized to fit its container.

- `fill` - This is default. The image is resized to fill the given dimension. If necessary, the image will be stretched or squished to fit
- `contain` - The image keeps its aspect ratio, but is resized to fit within the given dimension
- `cover` - The image keeps its aspect ratio and fills the given dimension. The image will be clipped to fit
- `none` - The image is not resized
- `scale-down` - the image is scaled down to the smallest version of `none` or `contain`

### `object-position`

### Masking

With CSS masking you create a mask layer to place over an element to partially or fully hide portions of the element.

> **Note:** Most browsers only have partial support for CSS masking. You will need to use the -webkit- prefix in addition to the standard property in most browsers.

```css
.mask1 {
  -webkit-mask-image: url(w3logo.png);
  mask-image: url(w3logo.png);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
```

### User Interface

* `resize`

The `resize` property specifies if (and how) an element should be resizable by the user.

* `outline-offset`

The `outline-offset` property adds space between an outline and the edge or border of an element.

