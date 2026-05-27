---
title: 【Python】Matplotlib
date: 2021-01-14 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- AI
---

Matplotlib is a low level graph plotting library in python that serves as a visualization utility.

Matplotlib was created by John D. Hunter.

Most of the Matplotlib utilities lies under the `pyplot` submodule, and are usually imported under the `plt` alias.

## Plotting

The `plot()` function is used to draw points (markers) in a diagram.

To plot only the markers, you can use *shortcut string notation* parameter 'o', which means 'rings'.

```python
xpoints = np.array([1, 8])
ypoints = np.array([3, 10])

plt.plot(xpoints, ypoints, 'o')
plt.show()
```

If we do not specify the points in the x-axis, they will get the default values 0, 1, 2, 3, 

### Maker

You can use the keyword argument `marker` to emphasize each point with a specified marker

```python
plt.plot(ypoints, 'o:r')
## marker|line|color
plt.show()
```

| Marker | Description    |                                                              |
| :----- | :------------- | ------------------------------------------------------------ |
| 'o'    | Circle         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_o) |
| '*'    | Star           | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_star) |
| '.'    | Point          | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_point) |
| ','    | Pixel          | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_pixel) |
| 'x'    | X              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_x) |
| 'X'    | X (filled)     | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_x_filled) |
| '+'    | Plus           | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_plus) |
| 'P'    | Plus (filled)  | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_plus_filled) |
| 's'    | Square         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_s) |
| 'D'    | Diamond        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_D) |
| 'd'    | Diamond (thin) | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_thin_d) |
| 'p'    | Pentagon       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_p) |
| 'H'    | Hexagon        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_H) |
| 'h'    | Hexagon        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_hexagon) |
| 'v'    | Triangle Down  | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_v) |
| '^'    | Triangle Up    | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_triangle_up) |
| '<'    | Triangle Left  | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_triangle_left) |
| '>'    | Triangle Right | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_triangle_right) |
| '1'    | Tri Down       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_1) |
| '2'    | Tri Up         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_2) |
| '3'    | Tri Left       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_3) |
| '4'    | Tri Right      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_4) |
| '\|'   | Vline          | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_marker_vline) |
| '_'    | Hline          |                                                              |



| Line Syntax | Description        |                                                              |
| :---------- | :----------------- | ------------------------------------------------------------ |
| '-'         | Solid line         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_line_solid) |
| ':'         | Dotted line        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_line_dot) |
| '--'        | Dashed line        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_line_dash) |
| '-.'        | Dashed/dotted line |                                                              |



| Color Syntax | Description |                                                              |
| :----------- | :---------- | ------------------------------------------------------------ |
| 'r'          | Red         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_r) |
| 'g'          | Green       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_g) |
| 'b'          | Blue        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_b) |
| 'c'          | Cyan        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_c) |
| 'm'          | Magenta     | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_m) |
| 'y'          | Yellow      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_y) |
| 'k'          | Black       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_matplotlib_fmt_k) |
| 'w'          | White       |                                                              |



You can use the keyword argument `markersize` or the shorter version, `ms` to set the size of the markers.

```python
plt.plot(ypoints, marker = 'o', ms = 20)
```





