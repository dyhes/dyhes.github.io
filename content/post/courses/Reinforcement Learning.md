---
title: 【Stanford Reinforcement Learning】Notes
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

##  Lecture 1 (intro)

### Element

* environment
* agent
* action
* observation and reward

### history

History $h_t=(a_1,o_1,r_1,...,a_t,o_t,r_t)$

agent choose action based on history

### state

state is information assumed to determine what happens next

function of history $s_t=f(h_t)$

The true state of the world used to determine how world  generates next observation and reward are often hidden or unknown to agent

assume state used by the agent is sufficient statistic of history

In practice often assume most recent observation is sufficient statistic of history: $s_t=o_t$

state representation has big implications for:

* computational complexity
* data required
* resulting performance

### Markov

state $s_t$ is Markov if and only if:
$$
p(s_{t+1}|s_{t},a_{t})=p(s_{t+1}|h_t,a_{t})
$$
future is independent of past given present

setting state as history always Markov: $s_t=h_t$

### RL Algorithm component

often include one or more of

* Model 

  representation of how  the world changes in response to agent's action

* Policy

  function mapping agent's states to action

* Value function

  future rewards from being in a state and/or action when following a particular policy

### Model

mathematical models of dynamics and reward, including:

**Transition/dynamics model** predicts next agent state
$$
p(s_{t+1}=s^{'}|s_t=s,a_t=a)
$$
**Reward model** predicts **immediate** reward
$$
r(s_t=s,a_t=a)=E[r_t|s_t=s,a_t=a]
$$

### Policy

policy $\pi:S\to A$, mapping from states to actions, determines how the agent chooses actions

* deterministic: $\pi(s)=a$
* stochastic: $\pi(a|s)=Pr(a_t=a|s_t=s)$

### Value

value function $V^\pi$ expected discounted sum of future rewards under a particular policy $\pi$
$$
V^\pi(s_t=s)=E_\pi[r_t+\gamma r_{t+1}+\gamma^2r_{t+2}+...|s_t=s]
$$
discount factor $\gamma$ weighs immediate vs future rewards

can be used to quantify goodness/badness of states and actions and decide how to act by comparing policies

### Types of RL agents

* Model-based
  * Explicit: Model
  * May or may not have policy and/ or value function
* Model-free
  * Explicit: Value function and /or policy function
  * No model

![image-20220928112645620](https://i.ibb.co/SK1SPXp/image-20220928112645620.png)

## Lecture 2 (MDP)

### Markov Process

* $S$ is a (finite) set of states ($s\in S$)

* $P$ is dynamics/transition model that specifies $p(s_{t+1}=s{'}|s_t=s)$ 

* no reward, no actions

* if finite number ($N$) of states, can express $P$ as a matrix
  $$
  P=\begin{pmatrix}
  P(s_1|s_1) & P(s_2|s_1) & ... &P(s_N|s_1)\\
  P(s_1|s_2) & P(s_2|s_2) & ... &P(s_N|s_2)\\
  ... & ... & ... & ...\\
  P(s_1|s_N) & P(s_2|s_N) & ... &P(s_N|s_N)\\
  \end{pmatrix}
  $$

 A Markov chain is the discrete-time version of a Markov process.

### Markov Reward Process(MRP)

* $S$ is a (finite) set of states ($s\in S$)
* $P$ is dynamics/transition model that specifies $P(s_{t+1}=s{'}|s_t=s)$ 
* $R$ is a reward function $R(s_t=s)=E[r_t|s_t=s]$
* Discount factor $\gamma\in [0,1]$
* no actions
* if finite number ($N$) of states, can express $R$ as a vector

#### horizon

* number of time steps in each episode
* can be infinite
* otherwise called finite Markov reward process

#### Return $G_t$ (for a MRP)

discounted sum of rewards from time step $t$ to horizon
$$
G_t=r_t+\gamma r_{t+1}+\gamma^2r_{t+2}+...
$$

#### State Value Function, $V(s)$ (for a MRP)

* expected return from starting in state $s$

$$
\begin{split}
V(s) & = E[G_t|s_t=s] \\
 & = E[r_t+\gamma r_{t+1}+\gamma^2r_{t+2}+...|s_t=s]
\end{split}
$$

* MRP value function satisfies
  $$
  V(s)=R(s)+\gamma\sum_{s^{'}\in S}P(s^{'}|s)V(s^{'})
  $$
  where $R(s)$ is immediate reward and the later part is the discounted sum of future rewards

  then:
  $$
  V=R+\gamma PV
  $$
  namely:
  $$
  V=(I-\gamma P)^{-1}R
  $$

### Markov Decision Process (MDP) 

* $S$ is a (finite) set of states ($s\in S$)
* $A$ is a (finite) set of actions $a\in A$
* $P$ is dynamics/transition model that specifies $P(s_{t+1}=s{'}|s_t=s，a_t=a)$ 
* $R$ is a reward function $R(s_t=s,a_t=a)=E[r_t|s_t=s,a_t=a]$
* Discount factor $\gamma\in [0,1]$

MDP is a tuple: $(S,A,P,R,\gamma)$

### Policy

* policy specifies what action to take in each state

  can be deterministic or stochastic

* for generality, consider as a conditional ditribution

  given a state, specifies a distribution over actions

* Policy: $\pi(a|s)=P(a_t=a|s_t=s)$

MDP+$\pi(a|s)$=Markov Reward Process

precisely, it is the MRP $(S,R^\pi,P^\pi,\gamma)$, where
$$
R^\pi(s)=\sum_{a\in A}\pi(a|s)R(s,a)
\newline
P^\pi(s^{'}|s)=\sum_{a\in A}\pi(a|s)P(s^{'}|s,a)
$$
implies we can use same techniques to evaluate the value of a policy for a MDP as we could to compute the value of a MRP, by defining a MRP with $R^{\pi}$ and $P^{\pi}$

### control

compute the optimal policy
$$
\pi^*(s)=arg\,max_{\pi}V^{\pi}(s)
$$
there exists an unique optimal value function

but the optimal policy is not unique

optimal policy for a MDP in an infinite horizon problem (agent a acts forever) is:

* deterministic
* stationary (does not depend on time step)
* not necessarily unique

#### Policy Iteration

computes optimal value and policy

* set $i= 0$
* initialize $\pi_0(s)$ randomly for all states $s$
* while $i==0$ or $||\pi_i-\pi_{i-1}||_1>0$ (L1-norm, measures if the policy changed for any state):
  * $V^{\pi_i}\leftarrow$ MDP V function policy evaluation of $\pi_i$
  * $\pi_{i+1}\leftarrow $ Policy improvement
  * $i=i+1$

##### State-Action Value Q

State-action value of a policy
$$
Q^{\pi}(s,a)=R(s,a)+\gamma\sum_{s^{'}\in S}P(s^{'}|s,a)V^{\pi}(s^{'})
$$
take action a, then follow the policy $\pi$ later on

##### policy improvement

* compute state-action value of a policy  $\pi_i$

  * for $s$ in $S$ and $a$ in $A$:
    $$
    Q^{\pi_i}(s,a)=R(s,a)+\gamma\sum_{s^{'}\in S}P(s^{'}|s,a)V^{\pi_i}(s^{'})
    $$

* conpute new policy $\pi_{i+1}$, for all $s\in S$
  $$
  \pi_{i+1}(s)=arg\,max_a\,Q^{\pi_i}(s,a)\,\forall s\in S
  $$

##### definition

$$
V^{\pi_1}\ge V^{\pi_2}:V^{\pi_1}(s)\ge V^{\pi_2}(s),\forall s\in S
$$

#### Value Iteration

miantain optimal value of starting in a state $s$ if  have a finite number of steps $k$ left in the episode

iterate to consider longer and longer episodes

* set $k=1$

* initialize $V_0(s)=0$ all states $s$

* loop until finite horizon or convergence:

  * for each state $s$
    $$
    V_{k+1}(s)=max_aR(s,a)+\gamma\sum_{s^{'}\in S}P^{\pi}(s^{'}|s)V^{\pi}(s^{'})
    $$

  * view as bellman backup on value function
    $$
    V_{k+1}=BV_k
    \newline
    \pi_{k+1}(s)=arg\,max_aR(s,a)+\gamma\sum_{s^{'}\in S}P^{\pi}(s^{'}|s)V^{\pi}(s^{'})
    $$

##### Bellman

value function of a policy must satisfy the Bellman equation
$$
V^{\pi}(s)=R^{\pi}(s)+\gamma\sum_{s^{'}\in S}P^{\pi}(s^{'}|s)V^{\pi}(s^{'})
$$
bellman backup operator

* applied to a value function
* returns a new value function
* improves the value if possible

$$
BV(s)={max}_aR(s,a)+\gamma\sum_{s^{'}\in S}P^{\pi}(s^{'}|s)V^{\pi}(s^{'})
$$

* $BV$ yields a value function over all states $s$

#### Policy iteration as Bellman Operations

Bellman backup operator $B^{\pi}$ for a particular policy is defined as
$$
B^{\pi}V(s)=R^{\pi}(s)+\gamma\sum_{s^{'}\in S}P^{\pi}(s^{'}|s)V^{\pi}(s^{'})
$$
policy evaluation amounts to computing the fixed point of $B^{\pi}$

to do policy evaluation. repeatedly apply operator until $V$ stops chaning
$$
V^{\pi}=B^{\pi}...B^{\pi}V
$$

## Lecture 3 (model-free evaluation)

### Dynamic programming for policy evaluation

given dynamics model $p$ and reward model $r$, namely the model is known

* initialize $V_0(s)=0$ all states $s$

* for $k=1$ until convergence

  * for all $s$ in $S$

    $V_{k}^{\pi}(s)=r(s,\pi(s))+\gamma\sum_{s^{'}\in S}P(s^{'}|s,\pi(s))V^{\pi}_{k-1}(s^{'})$

$V_{k}^{\pi}(s)$ is exact value of $k$-horizon value of state $s$ under policy $\pi$, and it's an estimate of infinite horizon value of state $s$ under policy $\pi$
$$
V_{k}^{\pi}(s)=E_{\pi}[G_t|s_t=s]\approx E_{\pi}[r_t+\gamma V_{k-1})|s_t=s]
$$

### Monte Carlo policy evaluation

does not require MDP dynamics/rewards so are used when model is unkown
$$
V^{\pi}(s)=E_{T\sim \pi}[G_t|s_t=s]
$$

* expectation of trajectories $T$ generated by following $\pi$

* the idea is Value = mean return

* does not assume state is Markov

* can only be applied to episodic MDPs

  * averaging over returns from a complete episode
  * requires each episode to terminate

* aim: estimate $V^\pi(s)$ given episodes generated under policy $\pi$

  $s_1,a_1,r_1,s_2,a_2,r_2,...$ where the actions are sampled from $\pi$

steps:

* initialize $N(s)=0,G(s)=0\forall s\in S$
* loop
  * sample episode $i=s_{i,1},a_{i,1},r_{i,1},s_{i,2},a_{i,2},r_{i,2},...,s_{i,T_i},a_{i,T_i},r_{i,T_i}$
  * define $G_{i,t}=r_{i,t}+\gamma r_{i,t+1}+\gamma^2r_{i,t+2}+...\gamma^{T_i-1}r_{i,T_i}$ as return from  time step $t$ onwards in $ith$ episode
  * for each state $s$ visited in episode $i$
    * for first time $t$ that state $s$ is visited in episode $i$
      * increment counter of total first visits: $N(s)=N(s)+1$
      * increment total return $G(s)=G(s)+G_{i,t}$
      * update estimate $V^{\pi}(s)=G(s)/N(s)$

#### Every-Visit MC

instead of for first time $t$ that state $s$ is visited in episode $i$, update $N(s),G(s)$ and $V^{\pi}(s)$ for every time $t$ that state $s$ is visited in episode $i$

this estimator is biased but is consistent and often has better MSE

#### Incremental MC

* sample episode $i=s_{i,1},a_{i,1},r_{i,1},s_{i,2},a_{i,2},r_{i,2},...,s_{i,T_i},a_{i,T_i},r_{i,T_i}$

* define $G_{i,t}=r_{i,t}+\gamma r_{i,t+1}+\gamma^2r_{i,t+2}+...\gamma^{T_i-1}r_{i,T_i}$ as return from  time step $t$ onwards in $ith$ episode

* for state $s$ visited at time step $t$ in episode $i$

  * increment counter of total visits: $N(s)=N(s)+1$

  * update estimate
    $$
    V^{\pi}(s)=V^{\pi}(s)\frac{N(s)-1}{N(s)}+\frac{G_{i,t}}{N(s)}=V^{\pi}(s)+\frac{1}{N(s)}(G_{i,t}-V^{\pi}(s))
    $$

##### Running Mean

estimation is updated as
$$
V^{\pi}(s)=V^{\pi}(s)+\alpha(G_{i,t}-V^{\pi}(s))
$$

* $\alpha=\frac{1}{N(s)}$: identical to every visit MC
* $\alpha\gt\frac{1}{N(s)}$: forget older data, helpful for non-stationary domains

### Temporal Difference(TD)

* combination of Monte Carlo & dynamic programming methods

* Model-free

* Bootstraps and samples

* can be used in episodic or infinite-horizon non-episodic settings

* immediately updates estimate of $V$ after each $(s,a,r,s^{'})$ tuple

* aim: estimate $v^{\pi}(s)$ given episodes generated under policy $\pi$

* have an estimate of $V^{\pi}$, use to estimate expected return
  $$
  V^{\pi}(s)=V^{\pi}(s)+\alpha([r_t+\gamma V^{\pi}(s_{t+1})]-V^{\pi}(s))
  $$

TD learning  

* Initialize $V^{\pi}(s)=0\forall s\in S$
* loop
  * sample tuple $(s_t,a_t,r_t,s_{t+1})$
  * $V^{\pi}(s_t)=V^{\pi}(s_t)+\alpha([r_t+\gamma V^{\pi}(s_{t+1})]-V^{\pi}(s_t))$

## Lecture 4 (model-free control)

* on-policy learning
  * direct experience
  * learn to estimate and evaluate a policy from experience obtained from following that policy

* off-policy learning
  * learn to estimate and evaluate a policy using experience gathered from following a different policy

### MC for On Policy Q Evaluation

* initialize $N(s,a)=0,G(s,a)=0,Q^{\pi}(s,a)=0\,\forall s\in S,\forall a\in A$
* loop
  * using policy $\pi$ sample episode $i=s_{i,1},a_{i,1},r_{i,1},s_{i,2},a_{i,2},r_{i,2},...,s_{i,T_i},a_{i,T_i},r_{i,T_i}$
  *  $G_{i,t}=r_{i,t}+\gamma r_{i,t+1}+\gamma^2r_{i,t+2}+...\gamma^{T_i-1}r_{i,T_i}$ 
  * for each state,action $(s,a)$ visited in episode $i$
    * for first or every time $t$ that state $(s,a)$ is visited in episode $i$
      * $N(s,a)=N(s,a)+1,G(s,a)=G(s,a)+G_{i,t}$
      * update estimate $Q^{\pi}(s,a)=G(s,a)/N(s,a)$

* given an estimate $Q^{\pi_i}(s,a)\forall s,a$

* update new policy
  $$
  \pi_{i+1}(s)=arg\,max_a\,Q^{\pi_i}(s,a)
  $$

### Monotonic $\epsilon$-greedy policy improvement

for any $\epsilon$-greedy policy $\pi_i$, the  ϵ-greedy policy w.r.t.(with respect to) $Q^{\pi_i}$, $\pi_{i+1}$ is a monotonic improvement $V^{\pi_{i+1}}\ge V^{\pi}$
$$
\begin{split}
Q^{\pi_i}(s,\pi_{i+1}(s)) & = \sum_{a\in A}\pi_{i+1}(a|s)Q^{\pi}(s,a) \\
 & = \frac{\epsilon}{|A|}\sum_{a\in A}Q^{\pi_i}(s,a)+(1-\epsilon)max_aQ^{\pi_i}(s,a)
\end{split}
$$

### Greedy in the Limit of Infinite Exploration(GLIE)

* all state-action pair are visited an infinite number of times
  $$
  {lim}_{i->\infty}N_i(s,a)\to\infty
  $$

* behavior policy converges to greedy policy

* a simple GLIE strategy is  $\epsilon$-greedy where  $\epsilon$ is reduced to 0 with the following rate
  $$
  \epsilon_i=\frac{1}{i}
  $$

### Monte Carlo Online Control /On Policy Improvement

* initialize $N(s,a)=0,G(s,a)=0,Q(s,a)=0\,\forall s\in S,\forall a\in A,set\,\epsilon=1,k=1$
* $\pi_1= \epsilon-greedy(Q)$
* loop
  * sample $k-th$ episode $(s_{k,1},a_{k,1},r_{k,1},s_{k,2},a_{k,2},r_{k,2},...,s_{k,T},a_{k,T},r_{k,T})$
  *  $G_{k,t}=r_{k,t}+\gamma r_{k,t+1}+\gamma^2r_{k,t+2}+...\gamma^{T-1}r_{k,T}$ 
  * for $t=1,...,T$ do
    * if first(or every ) vistit  to  $(s,a)$ in episode $k$ then
      * $N(s,a)=N(s,a)+1$
      *  $Q(s_t,a_t)=Q(s_t,a_t)+\frac{1}{N(s,a)}(G_{k,t}-Q(s_t,a_t))$
  * $k=k+1,\epsilon=\frac{1}{k}$
  * $\pi_k= \epsilon-greedy(Q)$

 ### SARSA

* set initial $\epsilon$-greedy policy $\pi$ randomly, $t$=0, initial state $s_t=s_0$
* take $a_t\sim\pi(s_t)$ //sample action from policy
* observe $(r_t,s_{t+1})$
* loop
  * take action $a_{t+1}\sim\pi(s_{t+1})$
  * observe $(r_{t+1},s_{t+2})$
  * $Q(s_t,a_t)=Q(s_t,a_t)+\alpha(r_t+\gamma Q(s_{t+1},a_{t+1})-Q(s_t,a_t))$
  * $\pi(s_t)=arg\,\max_aQ(s_t,a)$ w.prob $1-\epsilon$,else random
  * $t=t+1$

### Q-Learning

* initialize $Q(s,a)\,\forall s\in S,a\in A,t=0 $initial state $s_t=s_0$
* set $\pi_b$ to be $\epsilon$-greedy w.r.t $Q$

* loop
  * take action $a_{t}\sim\pi_b(s_{t})$
  * observe $(r_{t},s_{t+1})$
  * $Q(s_t,a_t)=Q(s_t,a_t)+\alpha(r_t+\gamma max_aQ(s_{t+1},a)-Q(s_t,a_t))$
  * $\pi(s_t)=arg\,\max_aQ(s_t,a)$ w.prob $1-\epsilon$,else random
  * $t=t+1$

### Double Q-learning

* initialize $Q_1(s,a)$ and $Q_2(s,a) \,\forall s\in S,a\in A,t=0 $ initial state $s_t=s_0$

* loop

  * select $a_t$ using $\epsilon$-greedy $\pi(s)=arg\,max_aQ_1(s_t,a)+Q_2(s_t,a)$

  * observe $(r_{t},s_{t+1})$

  * if (with 0.5 probability then

     $Q_1(s_t,a_t)=Q_1(s_t,a_t)+\alpha(r_t+\gamma max_aQ_1(s_{t+1},a)-Q_1(s_t,a_t))$

  * else

     $Q_2(s_t,a_t)=Q_2(s_t,a_t)+\alpha(r_t+\gamma max_aQ_2(s_{t+1},a)-Q_2(s_t,a_t))$

  * $t=t+1$

## Lecture 5 (Value Function Approximation)

represent a (state-action/state) value function with a parameterized function instead of a table
$$
\hat{V}(s;w)
\newline
\hat{Q}(s,a;w)
$$

### motivation

* don't want to have to explicitly store or learn for every single state a
  * dynamics or reward model
  * value
  * state-action value
  * policy
* want more compact representation that generalized acress state or states and actions

### function approximators

* linear combinations of features
* neural networks
* decision trees
* nearest neighbors
* fourier / wabelet bases

### Linear Value Function Approximation

* represent a value function (or state-action value function) for a particular policy with a weighted linear combination of features
  $$
  \hat{V}(s;w)=\sum_{j=1}^nx_j(s)w_j=x(s)^Tw
  $$

* objective function is
  $$
  J(w)=E_{\pi}[(V^{\pi}(s)-\hat{V}(s;w))^2]
  $$

* recall weight update is
  $$
  \Delta w=-\frac{1}{2}\alpha \nabla_wJ(w)
  $$

#### convergence guarantees

* the markov chain defined by a MDP with a paticular policy will eventually converge to a **probability distribution over state** $d(s)$

* $d(s)$ is called the stationary distribution over state of $\pi$

* $\sum_sd(s)=1$

* $d(s)$ satisfies the following balance equation:
  $$
  d(s)=\sum_{s'}\sum_a\pi(s'|a)p(s'|s,a)d(s')
  $$

* define the mean squared error of a linear value function approximation for a particular policy $\pi$ relative to the true value as
  $$
  MSVE(w)=\sum_{s\in S}d(s)(V^{\pi}(s)-\hat{V}^{\pi}(s;w))^2
  $$

### Monte Carlo Value Function Approximation

$$
J(w)=E_{\pi}[(G_t-\hat{V}(s;w))^2]
\newline
\Delta w=\alpha(G_t-x(s_t)^Tw)x(s_t)
$$

monte carlo policy evaluation with VFA converges to the weights $w_{MC}$ which has the minimum mean squared error possible:
$$
MSVE(w_{MC})=min_w\sum_{s\in S}d(s)(V^{\pi}(s)-\hat{V}^{\pi}(s;w))^2
$$

#### Batch Monte Carlo Value Function Approximation

let $G(s_i)$  be an unbiased sample of the true expected return $V^{\pi(s_i)}$
$$
arg\,min_w\sum_{i=1}^N(G(s_i)-x(s_i)^Tw)^2
$$
take the derivative and set to 0
$$
w=(X^TX)^{-1}X^TG
$$
where $G$ is a vector of all N returns, and $X$ is a matrix of the features of each of the N states $x(s_)$

### TD value Function Approximation

$$
J(w)=E_{\pi}[r+\gamma \hat{V}(s';w))^2]
\newline
\Delta w=\alpha(r+\gamma x(s')^Tw-x(s)^Tw)x(s)
$$

TD(0) policy evaluation with VFA converges to the weights $w_{TD}$ which is within a constant factor of the minimum mean squared error possible:
$$
MSVE(w_{TD})\le \frac{1}{1-\gamma}min_w\sum_{s\in S}d(s)(V^{\pi}(s)-\hat{V}^{\pi}(s;w))^2
$$

### control using Value Function Approximation

* use value function approximation to represent state-ation values $\hat{Q}^{\pi}(s,a;w)\approx Q^{\pi}$

$$
J(w)=E_{\pi}[(Q^{\pi}(s,a)-\hat{Q}(s,a;w))^2]
\newline
\Delta w=\alpha E[(Q^{\pi}(s,a)-\hat{Q}(s,a;w))\nabla_w\hat{Q}^{\pi}(s,a;w)]
$$

* use features to represent both the state and action
  $$
  x(s,a)=\begin{pmatrix}
  x_1(s,a)\\
  x_2(s,a)\\
  ...\\
  x_n(s,a)
  \end{pmatrix}
  $$

* monte carlo
  $$
  \Delta w=\alpha (G_t-\hat{Q}(s,a;w))\nabla_w\hat{Q}^{\pi}(s,a;w)
  $$

* SARSA
  $$
  \Delta w=\alpha (r+\gamma\hat{Q}(s',a';w)-\hat{Q}(s,a;w))\nabla_w\hat{Q}^{\pi}(s,a;w)
  $$

* Q_learning
  $$
  \Delta w=\alpha (r+\gamma\,max_{a'}\hat{Q}(s',a';w)-\hat{Q}(s,a;w))\nabla_w\hat{Q}^{\pi}(s,a;w)
  $$

## Lecture 6 (Deep Q Learning)

* Linear VFA often work well given the right set of features 
* But can require carefully hand designing that feature set
* An alternative is to use a much richer function approximation class that is able to directly go from states without requiring an explicit specification of features

### Deep Q-Networks(DQNs)

* represent state-action value function by Q-network with weights $w$
  $$
  \hat{Q}(s,a;w)\approx Q(s,a)
  $$

#### Experience Replay

* to help remove correlations, store dataset (called a replay buffer) $D$ from prior experience
* to perform experience replay., repeat:
  * $(s,a,r,s')\sim D$ :sample an experience tuple from the dataset
  * compute the target value for the sampled $s$：$r+\gamma\,max_{a'}\hat{Q}(s',a';w)$
  * use stochastic gradient descent to update the network weight

##### Prioritized Experience Replay

* let $i$ be the index of the $i$-th tuple of experience $s_i,a_i,r_i,s_{i+1} $

* sample tuples for update using priority function

* priority of a tuple is proportional to DQN error
  $$
  p_i=|r+\gamma\,max_{a'}\hat{Q}(s',a';w)-\hat{Q}(s,a;w)|
  $$

* update $p_i$ every update

* $p_i$ for new tuples is set to 0

* one method:
  $$
  P(i)=\frac{p_i^{\alpha}}{\sum_kp_k^{\alpha n}}
  $$

#### Fixed Q-Targets

* to help improve stability, fix the target weights used in the target calculation for multiple udpdates
* use a different set of weights to compute target that is being updated
* let parameters $w^-$ be the set of weights used in the target, and $``w$ be the weights that are being updated
* slight change to computation of target value:
  * sample $(s,a,r,s')\sim D$ 
  * compute $r+\gamma\,max_{a'}\hat{Q}(s',a';w^-)$
  * update $\Delta w=\alpha (r+\gamma\,max_{a'}\hat{Q}(s',a';w^-)-\hat{Q}(s,a;w))\nabla_w\hat{Q}(s,a;w)$

#### Double DQN

* current Q-network $w$ is used to select actions
* older Q-network $w^-$ is used to evaluate actions

#### Advantage Function

$$
A^{\pi}(s,a)=Q^{\pi}(s,a)-V^{\pi}(s)
$$

## Lecture 7 (Imitation Learning)

* Expert provides a set of demonstration trajectories: sequences of states and actions

* Imitation learning is useful when it is easier for the expert to demonstrate the desired behavior rather than:

  * specifying a reward that would generate such behavior
  * specifying the desired policy directly

* Input

  * state space, action space
  * transition model $P(s'|s,a)$
  * No reward function $R$
  * set of one or more teacher's demonstrations $(s_0,a_0,s_1,...)$ (actions drawn from teacher's policy $\pi^*$ )

* type

  * Behavioral cloning

    directly learn the teacher's policy

  * Inverse RL

    recover $R$

  * Apprenticeship learning via Inverse RL

    use $R$ to generate a good policy

### Behavioral Cloning

* formulate problem as a standard machine learning problem:
  * fix a policy class (e.g. neural network, decision tree, etc.)
  * estimate a policy from training examples $(s_0,a_0),s(_1,a_1)...$

not a good choice

### Inverse reinforcement learning

* Goal: given input, infer the reward function R

#### Linear Feature Reward Inverse RL

* consider reward is linear over features

  $$R(s)=w^Tx(s)$$

  where $w\in R^n,x:s\to R^n$

* Goal: identify weight vector $w$ given a set of demonstrations

* The resulting value function for a policy $\pi$ can be expressed as
  $$
  \begin{equation}
  \begin{split}
  V^{\pi}&=E[\sum_{t=0}^{\infty}\gamma^tR(s_t)|\pi]\\
  &=E[\sum_{t=0}^{\infty}\gamma^tw^Tx(s_t)|\pi]\\
  &=w^TE[\sum_{t=0}^{\infty}\gamma^tx(s_t)|\pi]\\
  &=w^T\mu(\pi)
  \end{split}
  \end{equation}
  $$
  where $\mu(\pi)(s)$ is defined as the discounted weighted frequency of state features under policy $\pi$

### Apprenticeship Learning

step

* assumption:$R(s)=w^Tx(s)$

* Initialize policy $\pi_0$

* loop

  * find a reward function such that the teacher maximally outperforms all previous controllers:
    $$
    arg\,max_wmax_{\gamma}s.t.w^T\mu(\pi^*)\ge w^T\mu(\pi)+\gamma\,\,\forall\pi\in\{\pi_0,\pi_1,...,\pi_{i-1}\}
    $$

  * s.t. $||w||_2\le 1$

  * find optimal control policy $\pi_i$ for the current $w$

  * exit if $\gamma\le\epsilon/2$

summary

* if expert policy is suboptimal then the resulting policy is a mixture of somewhat arbitrary policies which have expert in the convex hull
* in practice: pick the best one of this set and pick the corresponding reward function

## Lecture 8-10 (Policy Gradient)

Directly parametrize the policy
$$
\pi_{\theta}(s,a)=P[a|s;\theta]
$$
Goal is to find a policy $\pi$ with the highest value function $V^{\pi}$

* Advantages
  * better convergence properties
  * effective in high-dimensional or continuous action spaces
  * can learn stochastic policies
* Disadvantages
  * Typically converge to a local rather than global optimum
  * Evaluating a policy is typically inefficient and 

