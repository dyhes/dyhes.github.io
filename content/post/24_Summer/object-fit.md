---
title: 【CSS】Object-fit
date: 2024-07-25 00:00:00+0000
categories: 
    - nutrition
    - grass
tags:
    - CSS
---
The object-fit CSS property is used to specify how the content of a **replaced element**, such as an <img> or <video>, should be resized to fit its container. Replaced elements are elements **whose content is not managed by the CSS box model,** like images, videos, or iframes.
The object-fit property can take several values, which control how the replaced element’s content is resized:
## **fill**
* This is the **default** value.
* The content is resized to fill the container, **ignoring its aspect ratio**.
* The image or video may look distorted if the aspect ratio of the container **differs** from that of the content.
## **contain**
* The content is scaled to **maintain its aspect ratio** while fitting within the container.
* The entire content will be visible, but there may be **empty space** (letterboxing or pillarboxing) if the aspect ratios do not match.
## **cover**
* The content is scaled to maintain its aspect ratio while covering the entire container.
* Parts of the content might be cropped if the aspect ratio of the container and content do not match.
## **none**
* The content is not resized.
* The content is displayed at its original size, and it may overflow the container if it is larger than the container.
## **scale-down**
* The content is scaled down to fit within the container while maintaining its aspect ratio.
* This behaves like **contain** if the content is larger than the container, or like **none** if the content is smaller than the container.
