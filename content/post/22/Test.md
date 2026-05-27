---
title: 【Software Testing】Concepts
date: 2022-03-25 00:00:00+0000
categories: 
- nutrition
---

**Software testing** is a process, to evaluate the functionality of a software application with an intent to find whether the developed software met the specified requirements or not and to identify the defects to ensure that the product is defect-free in order to produce a quality product.

## Type

### By Categories

* **White** Box Testing

  It is also called Glass Box, Clear Box, Structural Testing. White Box Testing is based on the application’s **internal code structure**. In white-box testing, an **internal perspective** of the system, as well as programming skills, are used to design test cases. This testing is usually done **at the unit level**.

* **Black** Box Testing

  It is also called **Behavioral/Specification-Based/Input-Output Testing**. Black Box Testing is a software testing method in which testers evaluate the functionality of the software under test **without** looking at the internal code structure.

  * **Functional** Testing

    In simple words, **what the system actually does** is functional testing. To verify that each function of the software application behaves as specified in the requirement document. Testing all the functionalities by providing appropriate input to verify whether the actual output is matching the expected output or not. It falls within the scope of black-box testing and the testers need not concern about the source code of the application.

  * **Non-functional** Testing

    In simple words, **how well the system performs** is non-functionality testing. Non-functional testing refers to various aspects of the software such as **performance, load, stress, scalability, security, compatibility**, etc., The Main focus is to improve the **user experience** on how fast the system responds to a request.

* **Grey** Box Testing

  Grey box is the **combination** of both White Box and Black Box Testing. The tester who works on this type of testing needs to **have access to design documents**. This helps to create better test cases in this process.

### By Levels

![image-20220122200442042](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220122200442042.png)

- **Unit** Testing

  Unit Testing is done to check whether the individual modules of the source code are working properly. i.e. testing each and every unit of the application separately by the developer in the developer’s environment. It is AKA **Module Testing** or **Component Testing**. It is performed by using **White Box Testing** method. There are two types of Unit Testing – ***Manual*** & ***Automated***. 

- **Integration** Testing

  Integration Testing is the process of testing the **connectivity or data transfer** between a couple of unit tested modules. It is AKA I&T Testing or String Testing. It is sub divided into **Big Bang Approach, Top Down Approach, Bottom Up Approach and Sandwich or Hybrid Integration Approach** (Combination of Top Down and Bottom Up). 

  This process is carried out by using **dummy programs** called **Stubs** and **Drivers**. Stubs and Drivers do not implement the entire programming logic of the software module but just **simulate data communication** with the calling module.

  * **Big Bang Approach**

    Combining all the modules once and verifying the functionality after completion of individual module testing. In Big Bang Integration Testing, the individual modules are not integrated until all the modules are ready. Then they will run to check whether it is performing well. In this type of testing, some disadvantages might occur like, defects can be found at the later stage. It would be difficult to find out whether the defect arouse in interface or in module.

  * **Top-Down Approach**

    ![](https://www.softwaretestingmaterial.com/wp-content/uploads/2018/08/Top-Down-Approach.png?ezimgfmt=rs:781x439/rscb5/ng:webp/ngcb5)

    In Top Down Integration Testing, testing takes place **from top to bottom**. High-level modules are tested first and then low-level modules and finally integrating the low-level modules to a high level to ensure the system is working as intended.

    In this type of testing, **Stubs** are used as **temporary module** if a module is not ready for integration testing.

  * **Bottom-Up Approach**

    ![Bottom Up Approach](https://www.softwaretestingmaterial.com/wp-content/uploads/2018/08/Bottom-Up-Approach.png?ezimgfmt=rs:781x439/rscb5/ng:webp/ngcb5)

    It is a reciprocate of the Top-Down Approach. In Bottom Up Integration Testing, testing takes place from bottom to up. Lowest level modules are tested first and then high-level modules and finally integrating the high-level modules to a low level to ensure the system is working as intended. Drivers are used as a temporary module for integration testing.

  * Hybrid Integration Approach

- **System** Testing

  It’s a **black box testing**. Testing the fully integrated application is also called as an **end to end scenario testing**. To ensure that the software works in all intended target systems. Verify thorough testing of every input in the application to check for desired outputs. Testing of the user’s experiences with the application.

- **Acceptance** Testing

  To obtain customer sign-off so that software can be delivered and payments received. Types of Acceptance Testing are **Alpha, Beta & Gamma Testing**. Acceptance tests are formal tests executed to verify if a system satisfies its business requirements. They require the entire application to be up and running and focus on replicating user behaviors. But they can also go further and measure the performance of the system and reject changes if certain goals are not met.

  * **Alpha Testing**

    Alpha testing is mostly like performing **usability testing** which is done by the **in-house developers** who developed the software. Sometimes this alpha testing is done by the **client or outsiders** with the presence of developers or testers.

  * **Beta Testing**

    Beta testing is done by **a limited number of end users** before delivery, the change request would be fixed if the user gives feedback or reports defect.

  * **Gamma Testing**

    Gamma testing is done when the software is **ready for release** with specified requirements; this testing is done directly by skipping all the in-house testing activities.

## Principles

The Principles of Testing are as follows :

- Testing shows the presence of defects
- **Exhaustive** testing is **impossible**
- **Early** testing
- Defect clustering
- Pesticide paradox
- Testing is context-dependent
- Absence of error – a fallacy

It is equally important to test that your system doesn't break when **bad data** or **unexpected actions** are performed.























