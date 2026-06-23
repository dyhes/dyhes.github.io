---
title: 【HTML】 Basics
date: 2021-04-16 00:00:00+0000
categories: 
- nutrition
- grass
- temple
tags:
- HTML
---

## `<iframe>`

An iframe can be used as the target frame for a link.

The `target` attribute of the link must refer to the `name` attribute of the iframe:

## `<meta>`

The `<meta>` element is typically used to specify the character set, page description, keywords, author of the document, and viewport settings. The metadata will **not be displayed** on the page, but are **used by browsers** (how to display content or reload page), by **search engines** (keywords), and other web services.

* Define the **character set** used:

<meta charset="UTF-8">

* Define **keywords** for **search engines**:

<meta name="keywords" content="HTML, CSS, JavaScript">

* Define a **description** of your web page:

<meta name="description" content="Free Web tutorials">

* Define the **author** of a page:

<meta name="author" content="John Doe">

* **Refresh** document every 30 seconds:

<meta http-equiv="refresh" content="30">

* Setting the **viewport** to make your website look good on all devices:

<meta name="viewport" content="width=device-width, initial-scale=1.0">

## base

he `<base>` element specifies the base URL and/or target for all relative URLs in a page.

The `<base>` tag must have either an href or a target attribute present, or both.

There can only be one single `<base>` element in a document!

```html
<head>
<base href="https://www.w3schools.com/" target="_blank">
</head>
```

## Layout

There are four different techniques to create multicolumn layouts. Each technique has its pros and cons:

- CSS framework
- CSS float property
- CSS flexbox
- CSS grid

## Segmentic

In HTML there are some semantic elements that can be used to define different parts of a web page:  

- \<article>
- \<aside>
- \<details>
- \<figcaption>
- \<figure>
- \<footer>
- \<header>
- \<main>
- \<mark>
- \<nav>
- \<section>
- \<summary>
- \<time>

## Form

### Attribute

####  Action

The `action` attribute defines the action to be performed when the form is submitted.

**Tip:** If the `action` attribute is omitted, the action is set to the current page.

#### Target

The `target` attribute can have one of the following values:

| Value       | Description                                              |
| :---------- | :------------------------------------------------------- |
| _blank      | The response is displayed in a new window or tab         |
| _self       | The response is displayed in the current window          |
| _parent     | The response is displayed in the parent frame            |
| _top        | The response is displayed in the full body of the window |
| *framename* | The response is displayed in a named iframe              |

The default value is `_self` which means that the response will open in the current window.

#### Method

The `method` attribute specifies the HTTP method to be used when submitting the form data.

The form-data can be sent as URL variables (with `method="get"`) or as HTTP post transaction (with `method="post"`).

The default HTTP method when submitting form data is GET. 

**Notes on GET:**

- Appends the form data to the URL, in name/value pairs
- NEVER use GET to send sensitive data! (the submitted form data is visible in the URL!)
- The length of a URL is limited (2048 characters)
- Useful for form submissions where a user wants to bookmark the result
- GET is good for non-secure data, like query strings in Google

**Notes on POST:**

- Appends the form data inside the body of the HTTP request (the submitted form data is not shown in the URL)
- POST has no size limitations, and can be used to send large amounts of data.
- Form submissions with POST cannot be bookmarked

**Tip:** Always use POST if the form data contains sensitive or personal information!

#### Autocomplete

The `autocomplete` attribute specifies whether a form should have autocomplete on or off.

When autocomplete is on, the browser automatically complete values based on values that the user has entered before.

#### Novalidate

The `novalidate` attribute is a boolean attribute.

When present, it specifies that the form-data (input) should not be validated when submitted.

#### other

| Attribute                                                    | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [accept-charset](https://www.w3schools.com/tags/att_form_accept_charset.asp) | Specifies the character encodings used for form submission   |
| [action](https://www.w3schools.com/tags/att_form_action.asp) | Specifies where to send the form-data when a form is submitted |
| [autocomplete](https://www.w3schools.com/tags/att_form_autocomplete.asp) | Specifies whether a form should have autocomplete on or off  |
| [enctype](https://www.w3schools.com/tags/att_form_enctype.asp) | Specifies how the form-data should be encoded when submitting it to the server (only for method="post") |
| [method](https://www.w3schools.com/tags/att_form_method.asp) | Specifies the HTTP method to use when sending form-data      |
| [name](https://www.w3schools.com/tags/att_form_name.asp)     | Specifies the name of the form                               |
| [novalidate](https://www.w3schools.com/tags/att_form_novalidate.asp) | Specifies that the form should not be validated when submitted |
| [rel](https://www.w3schools.com/tags/att_form_rel.asp)       | Specifies the relationship between a linked resource and the current document |
| [target](https://www.w3schools.com/tags/att_form_target.asp) | Specifies where to display the response that is received after submitting the form |

### Element

The HTML `<form>` element can contain one or more of the following form elements:

- `<input>`
- `<label>`
- `<select>`
- `<textarea>`
- `<button>`
- `<fieldset>`
- `<legend>`
- `<datalist>`
- `<output>`
- `<option>`
- `<optgroup>`

#### input

The HTML `<input>` element is the most used form element.

An `<input>` element can be displayed in many ways, depending on the `type` attribute.

Here are some examples:

| Type                    | Description                                                  |
| :---------------------- | :----------------------------------------------------------- |
| <input type="text">     | Displays a single-line text input field, If the `name` attribute is omitted, the value of the input field will not be sent at all. |
| <input type="radio">    | Displays a radio button (for selecting one of many choices)  |
| <input type="checkbox"> | Displays a checkbox (for selecting zero or more of many choices) |
| <input type="submit">   | Displays a submit button (for submitting the form),The form-handler is specified in the form's `action` attribute. |
| <input type="button">   | Displays a clickable button                                  |

#### label

The `<label>` element is useful for screen-reader users, because the screen-reader will read out loud the label when the user focus on the input element.

The `<label>` element also help users who have difficulty clicking on very small regions (such as radio buttons or checkboxes) - because when the user clicks the text within the `<label>` element, it toggles the radio button/checkbox.

The `for` attribute of the `<label>` tag should be equal to the `id` attribute of the `<input>` element to bind them together.

#### select,option

```html
<label for="cars">Choose a car:</label>
<select id="cars" name="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>
```

The `<option>` elements defines an option that can be selected.

By default, the first item in the drop-down list is selected.

To define a pre-selected option, add the `selected` attribute to the option

Use the `multiple` attribute to allow the user to select more than one value

#### textarea

the `<textarea>` element defines a multi-line input field (a text area)

```html
<textarea name="message" rows="10" cols="30">
The cat was playing in the garden.
</textarea>
```

#### fieldset,legend

The `<fieldset>` element is used to group related data in a form.

The `<legend>` element defines a caption for the `<fieldset>` element.

```html
<form action="/action_page.php">
  <fieldset>
    <legend>Personalia:</legend>
    <label for="fname">First name:</label><br>
    <input type="text" id="fname" name="fname" value="John"><br>
    <label for="lname">Last name:</label><br>
    <input type="text" id="lname" name="lname" value="Doe"><br><br>
    <input type="submit" value="Submit">
  </fieldset>
</form>
```

#### datalist

The `<datalist>` element specifies a list of pre-defined options for an `<input>` element.

Users will see a drop-down list of the pre-defined options as they input data.

The `list` attribute of the `<input>` element, must refer to the `id` attribute of the `<datalist>` element.

```html
<form action="/action_page.php">
  <input list="browsers">
  <datalist id="browsers">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Chrome">
    <option value="Opera">
    <option value="Safari">
  </datalist>
</form>
```

## Graphics

### Canvas

The HTML `<canvas>` element is used to draw graphics, on the fly, via JavaScript.

The `<canvas>` element is only a container for graphics. You must use JavaScript to actually draw the graphics.

Canvas has several methods for drawing paths, boxes, circles, text, and adding images.

**Note:** Always specify an `id` attribute (to be referred to in a script), and a `width` and `height` attribute to define the size of the canvas. To add a border, use the `style` attribute.

### SVG

- SVG stands for Scalable Vector Graphics
- SVG is used to define graphics for the Web
- SVG is a W3C recommendation

SVG is a language for describing 2D graphics in XML.

Canvas draws 2D graphics, on the fly (with a JavaScript).

SVG is XML based, which means that every element is available within the SVG DOM. You can attach JavaScript event handlers for an element.

In SVG, each drawn shape is remembered as an object. If attributes of an SVG object are changed, the browser can automatically re-render the shape.

Canvas is rendered pixel by pixel. In canvas, once the graphic is drawn, it is forgotten by the browser. If its position should be changed, the entire scene needs to be redrawn, including any objects that might have been covered by the graphic.



