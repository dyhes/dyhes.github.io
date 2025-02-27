---
title: 【Python】.venv
date: 2025-01-13 00:00:00+0000
categories: 
    - temple
tags:
    - Python
---

The .venv directory is typically a folder that contains a **virtual environment** for Python projects. A virtual environment is a self-contained directory that holds a specific version of Python and any packages or libraries your project requires. This helps isolate your project’s dependencies from the global Python environment on your system, ensuring that each project has its own environment and dependencies without interfering with other projects.
When you execute a Python script in VS Code, if it’s using a .venv directory, it means that the script is running within this virtual environment. The .venv directory is often created by using the python -m venv .venv command or through VS Code’s environment setup.
Key points about .venv:
* It’s not a Python package itself but a directory.
* It helps in managing dependencies for a specific project.
* You can activate it using source .venv/bin/activate (Linux/macOS) or .venv\Scripts\activate (Windows) in the terminal.

⠀VS Code typically detects virtual environments and allows you to select the appropriate interpreter for your project, ensuring that Python uses the version and packages from the virtual environment rather than the system-wide installation.
