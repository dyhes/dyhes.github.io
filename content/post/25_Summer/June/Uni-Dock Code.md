---
title: 【MD】Uni-Dock
date: 2025-06-09 00:00:00+0000
categories: 
- snow
tags:
- Molecule Docking
---
## **Overall Structure**
The codebase is organized into several major components:
**1** **Core Library (****src/lib/****)**: Contains fundamental data structures and algorithms
**2** **CUDA Implementation (****src/cuda/****)**: GPU-accelerated components for performance
**3** **Main Application (****src/main/****)**: Command-line interface and application entry point
**4** **Split Utility (****src/split/****)**: Tool for processing multi-model PDBQT files
## Workflow
A typical Uni-Dock workflow appears to be:
1 Parse input files (receptors and ligands)
2 Set up the scoring function and parameters
3 Generate or load grid maps for efficient scoring
4 Perform global search (docking)
5 Refine and score the resulting poses
6 Output the best conformations
![](https://i.ibb.co/BVShhPJq/image.png)
## File Format
* PDBQT是AutoDock和AutoDock Vina等分子对接软件专用的格式，用于描述受体（如蛋白质）和配体（小分子）的结构信息。它在PDB格式基础上扩展了**电荷（Q）** 和**原子类型（T）** 两个关键字段
* SDF（Structure-Data File）是化学信息学中通用的分子结构描述格式，主要用于存储小分子的**2D/3D结构**、**化学性质**及**实验数据** （如生物活性）。常见于PubChem、DrugBank等数据库
* unidock/src/lib/parse_pdbqt.cpp
* unidock/src/split/split.cpp：处理 Multi-model PDBQT 多构象分子
  * 通过将每个模型提取到单独的文件中，以便在实际对接过程中更有效地处理。
## unidock/src/main/main.cpp
**1** **Command Line Interface**: Uses Boost's [program_options](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) library to process command-line arguments and configuration files.
* **Input**: Specifies receptors, flexible residues, and ligand files
* **Search space**: Defines the docking grid dimensions and positioning
* **Output**: Controls where results are stored
* **Advanced options**: Fine-tunes the docking algorithm behavior
* **Misc options**: Sets general parameters like CPU usage and random seed
> Boost是C++领域最具影响力的开源程序库集合，由全球开发者社区共同维护，旨在为C++标准库提供扩展功能，被称为“准标准库”
> **残基** （Residue）是生物大分子（如蛋白质、核酸）中构成其基本单元的组成部分，由氨基酸或核苷酸通过化学键连接后剩余的结构片段形成。
> 分子对接中的**柔性残基** （Flexible Residues）是指在对接过程中允许构象变化的受体蛋白残基。这类残基通常位于结合口袋内，其侧链或主链的灵活性会影响配体与受体的结合模式。通过模拟这些残基的动态调整，柔性残基对接能够更真实地反映生物分子间的相互作用，提升预测准确性。
**2** **Docking Workflow Management**: Handles various docking workflows including:
* Single ligand-receptor docking on CPU
* Batch docking of multiple ligands on GPU
* Paired batch processing for one-to-one ligand-protein docking
**3** **Memory Management**: Implements GPU memory management strategies to optimize batch processing.
A sophisticated batch processing system:
1 Classifies ligands into **size categories** (small, medium, large, extra large)
2 Processes ligands in batches to maximize GPU utilization
3 Predicts memory requirements to determine optimal batch sizes