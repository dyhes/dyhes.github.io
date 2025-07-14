---
title: 【Computer Vision】Notes
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

## History

* 1959 Hubel& Wiesel

* 1963 Roberts

* 1970s David Marr

* 1979 Gen.Cylinders

* 1986 Canny

* 1997 Norm.Cuts

* 199 SIFT

* 2001 V&J

  one of the first successful applications of machine learning to vision

* 2001 PASCAL

* 2009 ImageNet

  Olympics of computer vision

* 2012 AlexNet

  deep learning

### Another viewPoint

* 1958 perceptron

* 1969 Minsky & Papert

  showed that perceptrons could not learn the XOR function caused a lot of sidillusionment in the field

* 1980 Neocognition: Fukushima

  Computational model the visual system, directly inspired by Hubel and Wiesel's hierarchy of complex and simple cells

  interleaved simple cells(convolution) and complex cells(pooling)

  no practical training algorithm

* Backprop: Rumelhart, Hinton, and williams, 1986

  introduced backpropagation for computing gradients in neural networks

  successfully trained perceptrons with multiple layers

* Convolutional Networks:LeCun et al, 1998

* deep learning 2006

  people tried to train neural networks that were deeper and deeper

  not a mainstream research topic at this time

### Reason

* Algorithms
* Data
* Computation

## DataSet

* CIFAR10
* CIFAR100
* ImageNet
* Places365

### type

* train: train the model 
* validation :choose hypterparameter
* test: check out performance on new data

### cross-validation

split data into folds,try each fold as validation and average the results

## K-Nearest Neighbor

* very slow at test time
* distance metrics on pixels are not infomative  

## Linear Classifier

### Three Viewpoints

* Algebraic Viewpoint

  $f(x,W)=Wx$

* Visual Viewpoint

  One template per class

* Geometric Viewpoint

  Hyperplanes cutting up space

## Loss Function

a loss function tells how good our current classifier is

Also called: object function, cost function

Negative loss function sometimes called reward function, profit function, utility function, fitness function, etc 

Given a dataset
$$
{(x_i,y_i)}^N_{i=1}
$$
where $x_i$ is image and $y_i$ is (integer) label

Loss function for it may be
$$
L_i(f(x_i,W),y_i)
$$
Loss for the dataset is average of per-example losses:
$$
L=\frac{1}{N}\sum_iL_i(f(x_i,W),y_i)
$$

### SVM

Let $s=f(x_i,W)$ be scores

Then the SVM loss has the form:
$$
L_i=\sum_{j\neq y_i}max(0,s_j-s_{y_i}+margin)
$$

### Cross-Entropy(Multinomial Logistic Regression)

interpret raw classifier scores as probabilities
$$
s=f(x_i;W)
$$
softmax
$$
P(Y=k \lvert X=x_i)=\frac{e^{s_k}}{\sum_je^{   s_j}}
$$
then
$$
L_i=-logP(Y=y_i|X=x_i)
$$

### Regularization

prevent the model from doing too well on training data
$$
L(W)=L=\frac{1}{N}\sum_iL_i(f(x_i,W),y_i)+\lambda R(W)
$$
where  $\lambda$ is the regularization strength

* L2 Regularization

   $R(W)=\sum_k\sum_lW^2_{k,l}$

* L1 Regularization

   $R(W)=\sum_k\sum_l\lvert W_{k,l}\lvert$

* Elastic net(L1+L2)

   $R(W)=\sum_k\sum_l\beta W^2_{k,l}+\lvert W_{k,l}\lvert$

### Purpose

* express preferences in among models beyond "minimize training error"
* avoid overfitting: prefer simple models that generalize better
* improve optimization by adding curvature

## Optimization

$$
w^*=arg\,min_wL（w）
$$

### SGD

stochastic gradient descent
$$
x_{t+1}=x_{t}-\alpha \nabla f(x_t)
$$

### SGD+Momentum

$$
v_{t+1}=\rho v_{t}-\alpha \nabla f(x_t)
\newline
x_{t+1}=x_t+ v_{t+1}
$$

add velocity

### Nesterov Momentum

look ahead
$$
v_{t+1}=\rho v_t-\alpha\nabla f(x_t+\rho v_{t})
\newline
x_{t+1}=x_t+v_{t+1}
$$
let $\tilde{x_t}=x_t+\rho v_t$
$$
v_{t+1}=\rho v_t-\alpha \nabla f(\tilde{x_t})
\newline
\tilde{x_{t+1}}=\tilde{x_t}+v_{t+1}+\rho(v_{t+1}-v_t)
$$

### AdaGrad

$$
S_{t+1}=S_{t}+\nabla f(x_t)^2
\newline
x_{t+1}=x_t-\alpha \frac{\nabla f(x_t)}{\sqrt{S_{t}}+1e-7}
$$

might stop before converge

### RMSProp

"Leak Adagrad"
$$
S_{t+1}=\rho S_{t}+(1-\rho)\nabla f(x_t)^2
\newline
x_{t+1}=x_t-\alpha \frac{\nabla f(x_t)}{\sqrt{S_{t}}+1e-7}
$$

#### Adam

RMSProp+Momentum
$$
v_{t+1}=\rho v_{t}+\nabla f(x_t)
\newline
s_{t+1}=\beta s_{t}+(1-\beta)\nabla f(x_t)^2
\newline
v^{'}_{t+1}=\frac{v_{t+1}}{1-\rho ^t}
\newline
s^{'}_{t+1}=\frac{s_{t+1}}{1-\beta ^t}
\newline
x_{t+1}=x_t-\alpha \frac{v^{'}_{t+1}}{\sqrt{s^{'}_{t+1}}+1e-7}
$$

## Neural Network

### Activation Functions

* Sigmoid

  $\sigma(x)=\frac{1}{1+e^{-x}}$

* tanh

  $tanh(x)$

* ReLU

  $max(0,x)$

* Leaky ReLU

  $max(0.1x,x)$

* Maxout

  $max(w_1^Tx+b1,w_2^Tx+b2)$

* ELU

  $\left\{ 
      \begin{array}{lc}
          x & x \geqslant 0 \\
          \alpha(e^x-1)&x<0\\
      \end{array}
  \right.$

## Back propagation

$$
\frac{\partial L}{\partial y}=\frac{\partial g}{\partial y}\frac{\partial L}{\partial g}
$$

where

 $\frac{\partial y}{\partial f}$ is the downstream gradient

$\frac{\partial y}{\partial g}$ is the local gradient

$\frac{\partial g}{\partial f}$ is the upstream gradient

## Convolutional Networks

### Convolutional Layer

#### evaporative

* Input W
* Filter: K
* Output: W-K+1

add Padding

* Padding: P
* Output: W-K+1+2P

same padding: Input equals Output

#### Receptive Fields

each successive convolution adds K-1 to the receptive field size 

With L layers the receptive field size is 1+L*(K-1)

to expand receptive fields

* stride: S
* output: (W-K+2P)/S+1

#### summary

* Input: $C_{in}\times H \times W$

* Hyperparameters:

  * Kernel size: $K_H \times K_W$
  * Number of filters: $C_{out}$
  * Padding: $P$
  * stride: $S$

* Weight matrix: $C_{out} \times C_{in} \times K_H \times K_W$

  Bias Vector: $C_{out}$

* Ouput: $C_{out} \times H^{'}\times W^{'}$

  where

  $H^{'}=(H-L+2P)/S+1$

  $W^{'}=(W-L+2P)/S+1$

common settings:

*  $K_H = K_W$
* same padding
* $C_{out} ,C_{in} =32,64,128,256$

### Pooling Layer

to introduces invariance to small spatial shifts

Hyperparameters:

* kernel size
* stride
* pooling function

### Batch Normalization

normalize the outputs of a layer so they have zero mean and unit variance

It helps reduce "internal covariate shift", improves optimization
$$
\hat{x}^{(k)}=\frac{x^{(k)}-E[x^{(k)}]}{\sqrt{Var[x^{(k)}]}}
$$
Input: $N\times D$ when in fully connected layers. convolutional layers are the same

* $\mu_j=\frac{1}{N}\sum_{i=1}^Nx_{i,j}$

  Per-channel mean, shape is $1\times D$

  average of values seen during training while testing

* $\sigma_j^2=\frac{1}{N}\sum_{i=1}^N(x_{i,j}-\mu_j)^2$

  per-channel std, shape is $1\times D$

  average of values seen during training while testing

* $\hat{x}_{i,j}=\frac{x_{i,j}-\mu_j}{\sqrt{\sigma_j^2+\epsilon}}$

  normalized $x$, shape is $N\times D$

* $y_{i,j}=\gamma_j\hat{x}_{i,j}+\beta_j$

  output $y$, shape is $N\times D$

  $\gamma$ and $\beta$ is learnable scale and shift parameter of shape $1\times D$

### Layer Normalization

for fully connected layers

avoid different behavior between training and testing

the $\mu$ and $\sigma$ become shape of $N\times 1$

#### Instance Normalization

for convolutional layers

the $\mu$ and $\sigma$ become shape of $N\times C\times 1\times 1$ rather than shape of $1\times C\times 1\times 1$  in batch normalization

the $\gamma$ and $\beta$ remain as shape of $1\times C\times 1\times 1$

## Residual Networks

deep networks hard to train

a residual network is a stack of many residual blocks

![image-20220924193218252](https://i.ibb.co/xJSzxph/image-20220924193218252.png)

## Programming GPUs

* CUDA(NVIDIA only)

* OpenCL

  similar to CUDA, but runs on anything

  usually slower on NVIDIA hardware

## Pytorch

### Three levels of abstraction

* Tensor

  like a numpy array, but can run on GPU

* Autograd

  Package for building computational graphs out of Tensors, and automatically computing gradients

* Module

  A neural network layer; may store state or learnable weights

## Training Neural Networks

### Activation Function

#### Sigmoid

* 'kill' the gradient when saturated
*  outputs are not zero-centered
* exp() is a bit compute expensive

#### tanh

* zero centered
* 'kill' the gradient when saturated

#### ReLU

* Does not saturate(in position region)
* very computationally efficient
* converges much faster than sigmoid/tanh in practice
* not zero-centered output
* will never activate 'dead ReLU'

#### Leaky ReLU

* Does not saturate(in position region)
* very computationally efficient
* converges much faster than sigmoid/tanh in practice
* not zero-centered output
* will not 'die'

#### Parametric Rectifier(PReLU)

$$
f(x)=max*\alpha x,x
$$

#### Exponential Linear Unit(ELU)

$$
\left\{ 
    \begin{array}{lc}
        x & x \geqslant 0 \\
        \alpha(e^x-1)&x<0\\
    \end{array}
\right.
$$

* all benefits of ReLU
* closer ti zero mean outputs
* negative saturation regime compared with Leaky ReLU adds some robustness to noise

#### Scaled Exponential Linear Unit(SELU)

$$
\left\{ 
    \begin{array}{lc}
        \lambda x & x \geqslant 0 \\
        \lambda\alpha(e^x-1)&x<0\\
    \end{array}
\right.
$$

#### summary

* don't think too much. Just use ReLU
* Try out Leaky ReLU/ELU/SELU/GELU if you need to squeeze that last 0.1%
* Don't use sigmoid or tanh

### Data Preprocessing

* normalization
* PCA
* whitening

### Weight Initialization

* small random numbers

  ```python
  W=0.01*np.random.randn(Din,Dout)
  ```

* Xavier initialization

  ```python
  W=np.random.randn(Din,Dout)/np.sqrt(Din)
  ```

* Kaiming/MSRA initialization

  ```python
  W=np.random.randn(Din,Dout)/np.sqrt(2/Din)
  ```

### Regularization

* L2
* L1
* Elastic net
* dropout
* data augmentation
  * random crops and scales
  * translation
  * rotation
  * stretching
  * shearing
  * lens distortion
* fractional pooling
* stochastic depth
* cutout
* mixup

### Learning rate schedule

#### Decay

* cosine

$$
\alpha_t=\frac{1}{2}\alpha_0(1+cos(\frac{t\pi}{T}))
$$

* linear

$$
\alpha_t=\alpha_0(1-\frac{t}{T})
$$

* inverse sqrt
  $$
  \alpha_t=\frac{\alpha_0}{\sqrt{t}}
  $$

### early stopping

stop training the model when accuracy on the validation set decreases or train for a long time, but always keep track of the model snapshot that worked best on val.

### choosing hyperparameters

random search is better than grid search

steps

* check initial loss
* overfit a small sample
* find LR that makes loss go down
* coarse gird, train for 1-5 epochs
* refine grid,train longer
* look at loss curves

### Model Ensembles

* use multiple independent models
* use multiple snapshots of a single model during training

### Transfer Learning

* train on imagenet
* use cnn as a feature extractor
* bigger dataset: Fine-Tuning

## Recurrent Networks

$$
h_t=f_W(h_{t-1},x_t)
$$

 ### Vanilla

$$
h_t=tanh(W_{hh}h_{t-1}+W_{xh}x_t)
\newline
y_t=W_{hy}h_t
$$

* Exploding gradients

  gradient clipping:scale gradient if its norm is too big

* vanishing gradients

  change RNN architecture

 ### Truncated Backpropagation Through Time

carry hidden states forward in time forever, but only backpropagate for some smaller number of steps

### LSTM

compute four gates at each timestep
$$
\begin{pmatrix}
i\\
f\\
o\\
g\\
\end{pmatrix}=
\begin{pmatrix}
\sigma\\
\sigma\\
\sigma\\
tanh\\
\end{pmatrix}W
\begin{pmatrix}
h_{t-1}\\
x_t\\
\end{pmatrix}
$$

* i

  input gate, whether to write cell

* f

  forget gate, whether to erase cell

* o

  output gate, how much to reveal cell

* g

  gate gate, how much to write to cell

$$
c_t=f\bigodot c_{t-1}+i\bigodot g
\newline
h_t=o\bigodot tanh(c_t)
$$

where $c_t$ is the cell state and $h_t$ is the hidden state

### Multilayer

* RNN
  $$
  h_t^l=tanhW^l\begin{pmatrix}h_t^{l-1}\\h_{t-1}^l\end{pmatrix}
  $$
  where $h\in R^n$ and $W^l [n\times 2n]$

* LSTM
  $$
  \begin{pmatrix}
  i\\
  f\\
  o\\
  g\\
  \end{pmatrix}=
  \begin{pmatrix}
  sigm\\
  sigm\\
  sigm\\
  tanh\\
  \end{pmatrix}W^l
  \begin{pmatrix}
  h_{t}^{l-1}\\
  h_{t-1}^l\\
  \end{pmatrix}
  \newline
  $$

  $$
  c_t^l=f\bigodot c^l_{t-1}+i\bigodot g
  \newline
  h_t^l=o\bigodot tanh(c_t^l)
  $$

## Attention

![image-20220929130002973](https://i.ibb.co/WvVgRJP/image-20220929130002973.png)

above $\sum_ia_{t,i}$ should be 1

use a different context vector in each timestep of decoder

 ![image-20220929133844786](https://i.ibb.co/BrPWrzy/image-20220929133844786.png)

### Attention Layer

Input

* query vector: $q$ (shape: $D_Q$)

* input vectors: $X$ (shape:$N_X \times D_X$)

* similarity function: $f_{att}$

  usually **scaled dot product**

  the reason is

  large similarities will cause softmax to saturate and give vanishing gradients 

Computation

* similarities: $e$ (shape $N_X$) 

  $e_i=f_{att}(q,X_i)$

  usually $e_i=q\cdot X_i/sqrt(D_Q)$

* attention weights: $a=softmax(e)$ (shape $N_X$)

* output vector: $y=\sum_ia_iX_i$ (shape $D_X$)

#### multiple query

multiply query vectors

Input

* query vector: $Q$ (shape: $N_Q\times D_X$)
* input vectors: $X$ (shape:$N_X \times D_Q$)

Computation

* similarities: $E=QX^T$ (shape $N_Q\times N_X$) 

   $E_{i,j}=Q_i\cdot X_j/sqrt(D_Q)$

* attention weights: $a=softmax(E,dim=1)$ (shape $N_Q\times N_X$)

* output vector: $Y=AX$ (shape $N_Q\times D_X$)

  $Y_i=\sum_jA_{i,j}X_j$ 

#### seperate key and value

Input

* query vector: $Q$ (shape: $N_Q\times D_Q$)
* input vectors: $X$ (shape:$N_X \times D_X$)
* key  matrix: $W_K$   (shape:$D_X \times D_Q$)
* value matrix: $W_V$  (shape:$D_X \times D_V$)

Computation 

* key vectors: $K=XW_K$ (shape $N_X\times D_Q$) 
* value vectors: $V=XW_V$ (shape $N_X\times D_V$) 

* similarities: $E=QK^T$ (shape $N_Q\times N_X$) 

   $E_{i,j}=Q_i\cdot K_j/sqrt(D_Q)$

* attention weights: $a=softmax(E,dim=1)$ (shape $N_Q\times N_X$)

* output vector: $Y=AV$ (shape $N_Q\times D_V$)

  $Y_i=\sum_jA_{i,j}V_j$ 

### Self-Attention Layer

one query per input vector

Input

* input vectors: $X$ (shape:$N_X \times D_X$)
* key  matrix: $W_K$   (shape:$D_X \times D_Q$)
* value matrix: $W_V$  (shape:$D_X \times D_V$)
* query matrix: $W_Q$ (shape:$D_X\times D_Q$)

Computation 

* query vectors:$Q=XW_Q$

* key vectors: $K=XW_K$ (shape $N_X\times D_Q$) 
* value vectors: $V=XW_V$ (shape $N_X\times D_V$) 

* similarities: $E=QK^T$ (shape $N_Q\times N_X$) 

   $E_{i,j}=Q_i\cdot K_j/sqrt(D_Q)$

* attention weights: $a=softmax(E,dim=1)$ (shape $N_Q\times N_X$)

* output vector: $Y=AV$ (shape $N_Q\times D_V$)

  $Y_i=\sum_jA_{i,j}V_j$ 

![image-20220929144511303](https://i.ibb.co/h2zHF6Z/image-20220929144511303.png)

#### masked self-attention layer

don't let vectors "look ahead" in the sqeuence

used for language modeling (predict next word)

![image-20220929145019078](https://i.ibb.co/7QdcSqc/image-20220929145019078.png)

### Multihead self-attention layer

use $H$ independent "attention heads" in parallel

![image-20220929145319763](https://i.ibb.co/MnwG1G1/image-20220929145319763.png)

### CNN with self-attention

![image-20220929145552813](https://i.ibb.co/WnsTP0Y/image-20220929145552813.png)

### processing sequences

![image-20220929150003833](https://i.ibb.co/pxvZHyC/image-20220929150003833.png)

#### transformer block

![image-20220929150218418](https://i.ibb.co/vV4k7Rd/image-20220929150218418.png)

#### Transformer

a Transformer is a sequence of transformer blocks

can be used for transfer learning

* pretraining

  download a lot of text from the internet

  train a giant transformer model for language modeling

* finetuning

  fine-tune the transformer on your own NLP task

## Object Detection

* Input:

  Single RGB Image

* Output: 

  A set of detected objects, for each object predict:

  * Category label (from fixed,known set of categories)
  * Bounding box (four numbers: x,y,width,height)

* challenges
  * multiple outputs
  * multiple types of output
  * large images
* method
  * sliding window : too many boxes
  * region proposals:
    * find a small set of boxes that are likely to cover all objects
    * often based on heuristics
    * relatively fast to run

### Intersection over Union (IoU)

$$
\frac{area\;of\;Intersection}{Area\;of\;Union}
$$

### Overlapping Boxes: Non-Max Suppression (NMS)

* problem: Object detectors often output many overlapping detections
* solution: post-process raw detections using NMS
  1. select next highest-scoring box
  2. eliminate lower-scoring boxes with $IoU\gt threshold$
  3. if any boxes remain. goto 1.

### Evaluating: Mean Average Precision (mAP)

* run object detector on all test images
* for each category, compute average precision(AP)=area under Precision vs Recall Curve 
  * for each detection( highest score to lowest score)
    * if it matches some GT box with $IoU\gt 0.5$, mark it as positive and eliminate the GT
    * otherwise mark it as negetive
    * Plot a point on PR curve
  * average precision(AP)= area under PR curve
* mean average precision(mAP)=average of AP for each category
* for 'COCO mAP': compute mAP@thresh for each IoU threshold and take average

### "slow" R-CNN

Region-Based CNN 

* run region proposal method to compute ~2000 region proposals
* resize each region to fixed size and run independently through CNN to predict class scores and bbox transform
* use scores to select a subset of region proposals to output
* compare with ground-truth boxes

### Fast R-CNN

![image-20221013181339635](https://i.ibb.co/Q91BDNF/image-20221013181339635.png)

### Faster R-CNN:  learnable Region Proposals

insert RPN to predict proposals from features

otherwise same as Fast R-CNN

jointly train with 4 losses:

* RPN classification
* RPN regression
* Object classification
* Object regression

### Semantic Segmentation

Label each pixel in the image with a category label

Don't differentiate instances, only care about pixels

### Upsampling

unpooling

* bed of nails
* nearest neighbor
* bilinear interpolation
* bicubic interpolation
* max unpooling
* learnable upsampling: Transposed Convolution

### Instance Segmentation

* things: object categories that can be separated into object instance
* stuff: object categories that cannot be separated into instances

Mask R-CNN

### Panoptic Segmentation

Label all pixels in the image (both things and stuff)

for "thing" categories also separate into ins

## 3D Vision

two problems

* predicting 3D shapes from single image
* Processing 3D input data

more topics

* Computing correspondences
* multi-view stereo
* structure from motion
* simultaneous localization and  mapping (SLAM)
* Self-supervised learning
* View Synthesis
* Differentiable graphics
* 3D Sensors

Many non-Deep Learning methods alive and well in 3D

### 3D Shape Representations

* Depth Map

  Problem: Scale/Depth Ambiguity

  Scale invariant loss

* Voxel Grid

  for each pixel, surface normals give a vector giving the normal vector to the object in the world for that pixel

  * 3D convolution
  * Voxel Tubes

  Problem: Memory Usage

* Implicit Surface

  learn a function to classify arbitrary 3D points as inside/outside the shape

  $o:R^3->[0,1]$

  The surface of the 3D object is the level set $\{x:o(x)=\frac{1}{2}\}$

* PointCloud

  represent shape as a set of P points in 3D space

  * can represent fine structures without huge numbers of points
  * requires new architectures, losses, etc
  * doesn't explicitly represent the surface of the shape: extracting a mesh for rendering or other applications requires post-processing

* Mesh

  represent a 3D shape as a set of triangles

  Vertices: Set of V points in 3D space

  Faces: Set triangles over the vertices

### Graph Convolution

$$
f^{'}_i=W_0f_i+\sum_{j\in N(i)}W_1f_j
$$

### Metrics

* Voxel IoU

* Chamfer Distance

* F1 Score
  $$
  F1@t=2*\frac{Precision@t*Recall@t}{Precision@t+Reca}
  $$

## Generative Model

* Discriminative model
  * learn a probability distribution p(y|x)
  * used to:
    * assign labels to data
    * feature learning (with labels)
* Generative Model
  * distribution p(x)
  * used to:
    * detect outliers
    * feature learning (without label)
    * sample to generate new data
* Conditional Generative Model
  * learn p(x|y)
  * used to:
    * assign labels, while rejecting outliers. generate new data conditioned on input labels

![image-20221005141347631](https://i.ibb.co/8dXfpmR/image-20221005141347631.png)

### Taxonomy

* explicit density

  model can compute $p(x)$

  * Tractable density

    Autoregressive

    NADE/MADE

    NICE/RealNVP

    Glow

    Ffjord

  * Approximate density

    * Variational

      Variational Autoencoder

    * Markov Chain

      Boltzmann Machine

* implicit density

  does not explicitly compute $p(x)$, but can sample from $p(x)$

  * Markov Chain

    GSN

  * Direct

    Generative Adversarial Networks (GANs)

### Autoregressive

* Goal: write down an explicit function for $p(x)=f(x,W)$

* Given dataset $x^{(1)},x^{(2)}...x^{(N)}$, train the model by solving
  $$
  W^{*}=arg\,max_W\Pi_ip(x^{i})
  $$
  log trick to exchange product for sum
  $$
  arg\,max_W\sum_ilogp(x^{i})
  $$
  namely
  $$
  arg\,max_W\sum_ilogf(x^{i},W)
  $$
  this is the loss function.

* Assume x consists of multiple subparts
  $$
  x=(x_1,x_2,x_3,...,x_N)
  $$
  break down probability using the chain rule
  $$
  \begin{equation} \label{eq1}
  \begin{split}
  p(x) & =p(x_1,x_2,x_3,...,x_N) \\
   & = p(x_1)p(x_2|x_1)p(x_3|x_1,x_2)...\\
   &=\Pi_{t=1}^Tp(x_t|x_1,...,x_{t-1})
  \end{split}
  \end{equation}
  $$

#### PixelRNN

Generate image pixels one at a time, starting at the upper left corner

Compute a hidden state for each pixel that depends on hidden states and RGB values from the left and from above
$$
h_{x,y}=f(h_{x-1,y},h_{x,y-1},W)
$$
![image-20221005145834282](https://i.ibb.co/rGgF84c/image-20221005145834282.png)

#### PixelCNN

still generate image pixels starting from corner

dependency on previous pixels now modeled using a CNN over context region

![image-20221005170818945](https://i.ibb.co/dWS9XJx/image-20221005170818945.png)

#### Pros and Cons

* Pros
  * can explicitly compute likelihood $p(x)$
  * explicit likelihood of training data gives good evaluation metric
  * good samples
* Cons
  * sequential generation => slow

### Variational Autoencoder

variational autoencoder define an intractable density that we cannot explicitly compute or optimize

But we will be able to directly optimize a lower bound on the density

#### Autoencoders

unsupervised method for learning feature vectors from raw data x, without any labels

features should extract useful information that we can use for downstream tasks

![image-20221005172527253](https://i.ibb.co/gZVmwQJ/image-20221005172527253.png)

idea: use the features to reconstruct the input data with a decoder

![image-20221005172636415](https://i.ibb.co/r3vdqrb/image-20221005172636415.png)

features need to be lower dimensional that the data

after training, throw away decoder and use encoder for a downstream task

#### Variational Autoencoder

* assume training data $\{x^{(i)}\}_{i=1}^N$ is generated from unobserved (latent) representation $z$

* assume simple prior $p(z)$, e.g. Gaussian

* represent $p(x|z)$ with a neural network (similar to decoder from autoencoder)

* decoder must be probabilistic:

  Decoder input $z$, output mean $\mu_{x|z}$ and (diagonal) covariance $\sum_{x|z}$

  sample $x$ from Gaussian with mean  $\mu_{x|z}$ and (diagonal) covariance $\sum_{x|z}$ 

![image-20221005201326846](https://i.ibb.co/1Tv4GGP/image-20221005201326846.png)

so encoder and decoder be like

![image-20221005201508840](https://i.ibb.co/qnDVmc2/image-20221005201508840.png)
$$
\begin{equation} \label{eq2}
\begin{split}
logp_{\theta}(x) & =log\frac{p_{\theta}(x|z)p(z)}{p_{\theta}(z|x)}\\
 & = log\frac{p_{\theta}(x|z)p(z)q_{\phi}(z|x)}{p_{\theta}(z|x)q_{\phi}(z|x)}\\
 &=logp_{\theta}(x|z)-log\frac{q_{\phi}(z|x)}{p(z)}+log\frac{q_{\phi}(z|x)}{p_{\theta}(z|x)}\\
 &=E_z[logp_{\theta}(x|z)]-E_z[log\frac{q_{\phi}(z|x)}{p(z)}]+E_z[log\frac{q_{\phi}(z|x)}{p_{\theta}(z|x)}]\\
 &=E_{z\sim q_{\phi}(z|x)}[logp_{\theta}(x|z)]-D_{KL}(q_{\phi}(z|x),p(z))+D_{KL}(q_{\phi}(z|x),p(z))\\
 &\ge E_{z\sim q_{\phi}(z|x)}[logp_{\theta}(x|z)]-D_{KL}(q_{\phi}(z|x),p(z))
\end{split}
\end{equation}
$$
jointly train encoder q and decoder p to maximize the variational lower bound on the data likelihood

* run input data through encoder to get a distribution over latent codes (encoder output should match the prior $p(z)$)
* sample $z$ from encoder output
* run sampled $z$ through decoder to get a distribution over data samples
* original input data should be likely under the distribution output

![image-20221005204831140](https://i.ibb.co/42NYv9H/image-20221005204831140.png)

#### generate new data

* sample $z$ from prior $p(z)$
* run sampled $z$ through decoder to get distribution over data $x$
* sample from distribution obtained above to generate data

#### Pros and Cons

* Pros
  * principled approach to generative models
  * allows inference of $q(z|x)$, can be useful feature representation for other tasks
* Cons
  * maximizes lower bound of likelihood: okay, but not as good evaluation as PixelRNN/PixelCNN
  * samples blurrier and lower quality compared to state-of-the-art (GANs)

### GAN

![image-20221005212039207](https://i.ibb.co/XJ9YXSv/image-20221005212039207.png)

* Generative adversarial networks give up on modeling $p(x)$, but allow us to draw samples from $p(x)$

* Assume we have data $x_i$ drawn from distribution $p_{data}(x)$. Want to sample from $p_{data}$

* Introduce a latent variable $z$ with simple prior $p(z)$.

* Sample $z\sim p(z)$ and pass to a Generator network $x=G(z)$

* Then $x$ is a sample from the Generator distribution $p_G$. want $P_G=P_{data}$

* Train Generator Network G to convert $z$ into fake data $x$ sampled from $p_G$

  by "fooling" the discriminator D

* Train Discriminator Network D to classify data as real or fake(1/0)

jointly train generator G and discriminator D with a minmax game

![image-20221005212133215](https://i.ibb.co/x2br6t3/image-20221005212133215.png)
$$
\begin{equation}
\begin{split}
& min_G\,max_D(E_{x\sim p_{data}}[logD(x)]+E_{z\sim p(z)}[log(1-D(G(z)))])\\
&=min_G\,max_DV(G,D)
\end{split}
\end{equation}
$$
update 
$$
D=D+\alpha_D\frac{\partial V}{\partial D}
\newline
G=G-\alpha_G\frac{\partial V}{\partial G}
$$
this minimax game achieves its global minimum when $p_G=p_{data}$

=>some mathematical derivation

## Assignments 

### pytorch

[PyTorch](https://pytorch.org/) is an open source machine learning framework. At its core, PyTorch provides a few key features:

- A multidimensional **Tensor** object, similar to [numpy](https://numpy.org/) but **with GPU accelleration**.
- An optimized **autograd** engine for automatically computing derivatives
- A clean, modular API for building and deploying **deep learning models**

A `torch` **tensor** is a multidimensional grid of values, all of the same type, and is indexed by a tuple of nonnegative integers. The number of dimensions is the **rank** of the tensor; the **shape** of a tensor is a tuple of integers giving the size of the array along each dimension.

Accessing an element from a PyTorch tensor returns a PyTorch scalar; we can convert this to a Python scalar using the `.item()` method

#### tensor indexing

* slice indexing

  Slicing a tensor returns a **view** into the same data, so modifying it will also modify the original tensor. To avoid this, you can use the `clone()` method to make a copy of a tensor.

* integer indexing

  We can also use **index arrays** to index tensors; this lets us construct new tensors with a lot more flexibility than using slices.

  ```
  a[idx0, idx1]
  is equi
  torch.tensor([
    a[idx0[0], idx1[0]],
    a[idx0[1], idx1[1]],
    ...,
    a[idx0[N - 1], idx1[N - 1]]
  ])
  ```
  
  A one-hot vector for an integer n is a vector that has a one in its nth slot, and zeros in all other slots. One-hot vectors are commonly used to represent categorical variables in machine learning models.

* boolean indexing

  Boolean tensor indexing lets you pick out arbitrary elements of a tensor according to a boolean mask. Frequently this type of indexing is used to select or modify the elements of a tensor that satisfy some condition.

  In PyTorch, we use tensors of dtype `torch.bool` to hold boolean masks.

#### Reshape

PyTorch provides many ways to manipulate the shapes of tensors. The simplest example is [`.view()`](https://pytorch.org/docs/stable/generated/torch.Tensor.view.html): This returns a new tensor with the same number of elements as its input, but with a different shape.

As its name implies, a tensor returned by `.view()` shares the same data as the input, so changes to one will affect the other and vice-versa

We can use `.view()` to flatten matrices into vectors, and to convert rank-1 vectors into rank-2 row or column matrices:

As a convenience, calls to `.view()` may include a single -1 argument; this puts enough elements on that dimension so that the output has the same number of elements as the input. This makes it easy to write some reshape operations in a way that is agnostic to the shape of the tensor

In general, you should only use `.view()` to add new dimensions to a tensor, or to collapse adjacent dimensions of a tensor.

For tensors with more than two dimensions, we can use the function [`torch.transpose`](https://pytorch.org/docs/stable/generated/torch.transpose.html)) to swap arbitrary dimensions.

#### Computation

##### Elementwise

Basic mathematical functions operate elementwise on tensors, and are available as operator overloads, as functions in the `torch` module, and as instance methods on torch objects; all produce the same results:

```python
* + - / *
```

##### matrix

Note that unlike MATLAB, * is elementwise multiplication, not matrix multiplication. PyTorch provides a number of linear algebra functions that compute different types of vector and matrix products. The most commonly used are:

- [`torch.dot`](https://pytorch.org/docs/stable/generated/torch.dot.html): Computes inner product of vectors
- [`torch.mm`](https://pytorch.org/docs/stable/generated/torch.mm.html): Computes matrix-matrix products
- [`torch.mv`](https://pytorch.org/docs/stable/generated/torch.mv.html): Computes matrix-vector products
- [`torch.addmm`](https://pytorch.org/docs/stable/generated/torch.addmm.html) / [`torch.addmv`](https://pytorch.org/docs/stable/generated/torch.addmv.html): Computes matrix-matrix and matrix-vector multiplications plus a bias
- [`torch.bmm`](https://pytorch.org/docs/stable/generated/torch.bmm.html) / [`torch.baddmm`](https://pytorch.org/docs/stable/generated/torch.baddbmm.html): Batched versions of `torch.mm` and `torch.addmm`, respectively
- [`torch.matmul`](https://pytorch.org/docs/stable/generated/torch.matmul.html): General matrix product that performs different operations depending on the rank of the inputs. Confusingly, this is similar to `np.dot` in numpy.

You can find a full list of the available linear algebra operators [in the documentation](https://pytorch.org/docs/stable/torch.html#blas-and-lapack-operations).
All of these functions are also available as Tensor instance methods, e.g. [`Tensor.dot`](https://pytorch.org/docs/stable/generated/torch.Tensor.dot.html) instead of `torch.dot`.

Here is an example of using `torch.dot` to compute inner products. Like the other mathematical operators we've seen, most linear algebra operators are available both as functions in the `torch` module and as instance methods of tensors:

#### vectorization

In many cases, avoiding explicit Python loops in your code and instead using PyTorch operators to handle looping internally will cause your code to run a lot faster. This style of writing code, called **vectorization**, avoids overhead from the Python interpreter, and can also better parallelize the computation (e.g. across CPU cores, on on GPUs). Whenever possible you should strive to write vectorized code.

##### GPU

All PyTorch tensors also have a `device` attribute that specifies the device where the tensor is stored -- either CPU, or CUDA (for NVIDA GPUs). A tensor on a CUDA device will automatically use that device to accelerate all of its operations.

Just as with datatypes, we can use the [`.to()`](https://pytorch.org/docs/1.1.0/tensors.html#torch.Tensor.to) method to change the device of a tensor. We can also use the convenience methods `.cuda()` and `.cpu()` methods to move tensors between CPU and GPU.

squared_euclidean_distance(train_data,train_data.view(-1))
