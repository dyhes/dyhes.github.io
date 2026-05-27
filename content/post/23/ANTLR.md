---
title: 【ANTLR】Basics
date: 2023-04-13 00:00:00+0000
categories: 
- snow
---

## **left recursive grammar**

The biggest thing is the new adaptive parsing strategy, which lets us accept any grammar we care to write. That gives us a huge productivity boost because we can now write much more natural expression rules (which occur in almost every grammar). 

ANTLR v4 will also take **left recursive grammar** now, translating it secretly to a non-left recursive version.

## Grammar Lexicon

### **identifier**

Token names always start with a capital letter and so do lexer rules. 

Parser rule names always start with a lowercase letter (those that fail `Character.isUpperCase`). The initial character can be followed by uppercase and lowercase letters, digits, and underscores. 

Here are some sample names:

```g4
ID, LPAREN, RIGHT_CURLY // token names/lexer rules
expr, simpleDeclarator, d2, header_file // parser rule names
```

### **literal**

ANTLR **does not distinguish** between character and string literals as most languages do. All literal strings one or more characters in length are enclosed **in single quotes** such as `';'`, `'if'`, `'>='`, and `'\''` (refers to the one-character string containing the single quote character). 

Literals **never** contain regular expressions.

Literals can contain Unicode escape sequences of the form `'\uXXXX'` (for Unicode code points up to `'U+FFFF'`) or `'\u{XXXXXX}'` (for all Unicode code points), where `'XXXX'` is the hexadecimal Unicode code point value.

ANTLR also understands the usual special escape sequences: `'\n'` (newline), `'\r'` (carriage return), `'\t'` (tab), `'\b'` (backspace), and `'\f'` (form feed). You can use Unicode code points directly within literals or use the Unicode escape sequences.

### Actions

Actions are **code blocks written in the target language**. 

You can use actions in a number of places within a grammar, but the syntax is always the same: 

arbitrary text surrounded by curly braces. 

You don’t need to escape a closing curly character if it’s in a string or comment

If the curlies are balanced, you also don’t need to escape }.

Otherwise, escape extra curlies with a backslash: `\{` or `\}`. 



Embedded code can appear in: `@header` and `@members` named actions, parser and lexer rules, exception catching specifications, attribute sections for parser rules (return values, arguments, and locals), and some rule element options (currently predicates).

The **only interpretation** ANTLR does inside actions relates to grammar attributes; see [Token Attributes](http://pragprog.com/book/tpantlr2/the-definitive-antlr-4-reference) and Chapter 10, [Attributes and Actions](http://pragprog.com/book/tpantlr2/the-definitive-antlr-4-reference). 

Actions embedded within lexer rules are emitted without any interpretation or translation into generated lexers.

### **Keywords**

Here’s a list of the reserved words in ANTLR grammars:

```
import, fragment, lexer, parser, grammar, returns,
locals, throws, catch, finally, mode, options, tokens
```

Also, although it is not a keyword, do not use the word `rule` as a rule name. Further, do not use any keyword of the target language as a token, label, or rule name. For example, rule `if` would result in a generated function called `if`. That would not compile obviously.

## Grammar Structure

A grammar is essentially a grammar declaration followed by a list of rules, but has the general form:

```
/** Optional javadoc style comment */
grammar Name;
options {...}
import ... ;
 	
tokens {...}
channels {...} // lexer only
@actionName {...}
 	 
rule1 // parser and lexer rules, possibly intermingled
...
ruleN
```

You can specify options, imports, token specifications, and actions in any order.

All of those elements are optional except for the header grammar Name and at least one rule. Rules take the basic form:

```
ruleName : alternative1 | ... | alternativeN ;
```

Grammars defined without a prefix on the `grammar` header are combined grammars that can contain both lexical and parser rules.

Only lexer grammars can contain `mode` specifications.

Only lexer grammars can contain custom channels specifications

```
channels {
  WHITESPACE_CHANNEL,
  COMMENTS_CHANNEL
}
```

Those channels can then be used like enums within lexer rules

### Grammar import

Grammar `imports` let you break up a grammar into logical and reusable chunks. ANTLR treats imported grammars very much like object-oriented programming languages treat super-classes. A grammar inherits all of the rules, tokens specifications, and named actions from the imported grammar. Rules in the “main grammar” **override rules** from imported grammars to implement inheritance.

### Tokens Section

The purpose of the `tokens` section is to define token types needed by a grammar for which there is no associated lexical rule. The basic syntax is:

```
tokens { Token1, ..., TokenN }
```

Most of the time, the tokens section is used to define token types **needed by actions in the grammar**.

```
// explicitly define keyword token types to avoid implicit definition warnings
tokens { BEGIN, END, IF, THEN, WHILE }
 
@lexer::members { // keywords map used in lexer to assign token types
Map<String,Integer> keywords = new HashMap<String,Integer>() {{
	put("begin", KeywordsParser.BEGIN);
	put("end", KeywordsParser.END);
	...
}};
}
```

### Action at the grammar level

Currently there are **only two** defined named actions (for the Java target) used outside of grammar rules: `header` and `members`. The former injects code into the generated recognizer class file, before the recognizer class definition, 

and the latter injects code into the recognizer class definition, as fields and methods.

For combined grammars, ANTLR injects the actions into both the parser and the lexer. To restrict an action to the generated parser or lexer, use `@parser::name` or `@lexer::name`.

```
grammar Count;
 
@header {
package foo;
}
 
@members {
int count = 0;
}
```

## Parser Rules

Parsers consist of a set of parser rules either in a parser or a combined grammar. A Java application launches a parser by invoking the rule function, generated by ANTLR, associated with the desired start rule. 

Rules can also have alternatives separated by the |

```
operator:
 	stat: retstat
 	| 'break' ';'
 	| 'continue' ';'
 	;
```

Alternatives are either **a list of rule elements or empty**. For example, here’s a rule with an empty alternative that makes the entire rule optional:

```
**superClass**：'extends' ID
 	| // empty
 	;
```

### Alternative labels

Labeling Rule Alternatives for Precise Event Methods, we can get **more precise parse-tree listener** events by labeling the outermost alternatives of a rule using the ## operator. **All** alternatives within a rule must be labeled, **or none** of them. 

Here are two rules with labeled alternatives.

```
grammar T;
stat: 'return' e ';' ## Return
 	| 'break' ';' ## Break
 	;
e   : e '*' e ## Mult
    | e '+' e ## Add
    | INT ## Int
    ;
```

Alternative labels do not have to be at the end of the line and there does not have to be a space after the ## symbol. 

ANTLR generates a **rule context class definition** for each label. For example, here is the listener that ANTLR generates:

```
public interface AListener extends ParseTreeListener {
 	void enterReturn(AParser.ReturnContext ctx);
 	void exitReturn(AParser.ReturnContext ctx);
 	void enterBreak(AParser.BreakContext ctx);
 	void exitBreak(AParser.BreakContext ctx);
 	void enterMult(AParser.MultContext ctx);
 	void exitMult(AParser.MultContext ctx);
 	void enterAdd(AParser.AddContext ctx);
 	void exitAdd(AParser.AddContext ctx);
 	void enterInt(AParser.IntContext ctx);
 	void exitInt(AParser.IntContext ctx);
}
```

There are **enter and exit methods** associated with each labeled alternative. The parameters to those methods are **specific** to alternatives.

You can reuse the same label on multiple alternatives to indicate that the parse tree walker should trigger **the same event** for those alternatives.

```
e : e '*' e ## BinaryOp
| e '+' e ## BinaryOp
| INT ## Int
;
```

### Rule Context Objects

ANTLR generates methods to access the **rule context objects (parse tree nodes)** associated with each rule reference. For rules with a single rule reference, ANTLR generates a method with no arguments. Consider the following rule.

```
 	inc : e '++' ;
```

ANTLR generates this context class:

```
public static class IncContext extends ParserRuleContext {
 	public EContext e() { ... } // return context object associated with e
 	...
}
```

ANTLR also provide support to access context objects when there is more than a single reference to a rule:

```
field : e '.' e ;
```

ANTLR generates a method with an index to access the ith element as well as a method to get context for all references to that rule:

```
public static class FieldContext extends ParserRuleContext {
 	public EContext e(int i) { ... } // get ith e context
 	public List<EContext> e() { ... } // return ALL e contexts
 	...
}
```

If we had another rule, s, that references field, an embedded action **could access the list of e rule matches performed by field**:

```
s : field
 	{
 	List<EContext> x = $field.ctx.e();
 	...
 	}
;
```

### Rule Element Labels

#### = operator

You can label rule elements using the **= operator** to add fields to the rule context objects:

```
stat: 'return' value=e ';' ## Return
 	| 'break' ';' ## Break
 	;
```

Here value is the label for the return value of rule e, which is defined elsewhere. Labels become fields in the appropriate parse tree node class.

In this case, label value becomes a field in ReturnContext because of the Return alternative label:

```
public static class ReturnContext extends StatContext {
 	public EContext value;
 	...
}
```

#### += operator

It’s often handy to **track a number of tokens**, which you can do with the **+= “list label” operator**. For example, the following rule creates a list of the Token objects matched for a simple array construct:

```
 	array : '{' el+=INT (',' el+=INT)* '}' ;
```

ANTLR generates a List field in the appropriate rule context class:

```
 	public static class ArrayContext extends ParserRuleContext {
 	public List<Token> el = new ArrayList<Token>();
 	...
 	}
```

These list labels also work for rule references:

```
 	elist : exprs+=e (',' exprs+=e)* ;
```

ANTLR generates a field holding the list of context objects:

```
 	public static class ElistContext extends ParserRuleContext {
 	public List<EContext> exprs = new ArrayList<EContext>();
 	...
 	}
```

### Rule Elements

Rule elements specify what the parser should do at a given moment just like statements in a programming language. The elements can be rule, token, string literal like expression, ID, and 'return'. Here’s a complete list of the rule elements (we’ll look at actions and predicates in more detail later):

| Syntax     | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| T          | Match token T at the current input position. Tokens always begin with a capital letter. |
| 'literal'  | Match the string literal at the current input position. A string literal is simply **a token with a fixed string**. |
| r          | Match rule r at current input position, which amounts to invoking the rule just like a function call. Parser rule names always begin with a lowercase letter. |
| r [«args»] | Match rule r at current input position, **passing in a list of arguments just like a function call**. The arguments inside the square brackets are in the syntax of the target language and are usually a comma-separated list of expressions. |
| {«action»} | Execute an action immediately after the preceding alternative element and immediately before the following alternative element. The action conforms to the syntax of the target language. ANTLR copies the action code to the generated class verbatim, except for substituting attribute and token references such as \$x and \$x.y. |
| {«p»}?     | Evaluate **semantic predicate** «p». Do not continue parsing past a predicate if «p» **evaluates to false** at runtime. Predicates encountered during prediction, when ANTLR distinguishes between alternatives, enable or disable the alternative(s) surrounding the predicate(s). |
| .          | Match any single token except for the end of file token. The “dot” operator is called the **wildcard**. |

When you want to match everything but a particular token or set of tokens, use the `~` “not” operator. This operator is rarely used in the parser but is available. 

### Subrules

A rule can contain alternative blocks called subrules (as allowed in Extended BNF Notation: EBNF). **A subrule is like a rule that lacks a name and is enclosed in parentheses**. Subrules can have one or more alternatives inside the parentheses. Subrules cannot define attributes with locals and returns like rules can. There are four kinds of subrules (x, y, and z represent grammar fragments):

| Syntax                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [![img](https://github.com/antlr/antlr4/raw/master/doc/images/xyz.png)](https://github.com/antlr/antlr4/blob/master/doc/images/xyz.png) | (x\|y\|z). Match any alternative within the subrule exactly once. Example: ` returnType : (type | 'void') ; ` |
| [![img](https://github.com/antlr/antlr4/raw/master/doc/images/xyz_opt.png)](https://github.com/antlr/antlr4/blob/master/doc/images/xyz_opt.png) | (x\|y\|z)? Match nothing or any alternative within subrule. Example: `	 classDeclaration    : 'class' ID (typeParameters)? ('extends' type)?      ('implements' typeList)? 	   classBody    ; ` |
| [![img](https://github.com/antlr/antlr4/raw/master/doc/images/xyz_star.png)](https://github.com/antlr/antlr4/blob/master/doc/images/xyz_star.png) | (x\|y\|z)* Match an alternative within subrule zero or more times. Example: ` annotationName : ID ('.' ID)* ; ` |
| [![img](https://github.com/antlr/antlr4/raw/master/doc/images/xyz_plus.png)](https://github.com/antlr/antlr4/blob/master/doc/images/xyz_plus.png) | (x\|y\|z)+ Match an alternative within subrule one or more times. Example: ` annotations : (annotation)+ ; ` |

You can suffix the `?`, `*`, and `+` subrule operators with the **nongreedy operator**, which is also a question mark: `??`, `*?`, and `+?`. 

As a **shorthand**, you can omit the parentheses for subrules composed of a single alternative with a single rule element reference. For example, `annotation+` is the same as `(annotation)+` and `ID+` is the same as `(ID)+`. Labels also work with the shorthand. `ids+=INT+` make a list of `INT` token objects.

### Catching Exceptions

When a syntax error occurs within a rule, ANTLR catches the exception, reports the error, attempts to recover (possibly by consuming more tokens), and then returns from the rule. Every rule is wrapped in a `try/catch/finally` statement:

```
void r() throws RecognitionException {
 	try {
 		rule-body
 	}
 	catch (RecognitionException re) {
	 	_errHandler.reportError(this, re);
	 	_errHandler.recover(this, re);
 	}
 	finally {
		exitRule();
 	}
}
```

We can use a strategy object to alter ANTLR’s error handling. Replacing the strategy changes the strategy **for all rules**, however. To alter the exception handling for a single rule, specify an exception after the rule definition:

```
r : ...
  ;
  catch[RecognitionException e] { throw e; }
```

That example shows how to avoid default error reporting and recovery. r rethrows the exception, which is useful when it makes more sense for a higher-level rule to report the error. Specifying any exception clause, prevents ANTLR from generating a clause to handle `RecognitionException`.

You can specify other exceptions as well:

```
r : ...
  ;
  catch[FailedPredicateException fpe] { ... }
  catch[RecognitionException e] { ... }
```

The code snippets inside curly braces and the exception “argument” actions must be written in the target language; Java, in this case. When you need to execute an action even if an exception occurs, put it into the `finally` clause:

```
r : ...
  ;
  // catch blocks go first
  finally { System.out.println("exit rule r"); }
```

The finally clause executes right before the rule triggers `exitRule` before returning. If you want to execute an action after the rule finishes matching the alternatives but before it does its cleanup work, use an `after` action.

Here’s a complete list of exceptions:

| Exception name            | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| RecognitionException      | The superclass of all exceptions thrown by an ANTLR-generated recognizer. It’s a subclass of RuntimeException to avoid the hassles of checked exceptions. This exception records where the recognizer (lexer or parser) was in the input, where it was in the ATN (internal graph data structure representing the grammar), the rule invocation stack, and what kind of problem occurred. |
| NoViableAltException      | Indicates that the parser could not decide which of two or more paths to take by looking at the remaining input. This exception tracks the starting token of the offending input and also knows where the parser was in the various paths when the error occurred. |
| LexerNoViableAltException | The equivalent of NoViableAltException but for lexers only.  |
| InputMismatchException    | The current input Token does not match what the parser expected. |
| FailedPredicateException  | A semantic predicate that evaluates to false during prediction renders the surrounding alternative nonviable. Prediction occurs when a rule is predicting which alternative to take. If all viable paths disappear, parser will throw NoViableAltException. This predicate gets thrown by the parser when a semantic predicate evaluates to false outside of prediction, during the normal parsing process of matching tokens and calling rules. |

### Rule Attribute Definitions

There are a number of action-related syntax elements associated with rules to be aware of. Rules can have **arguments, return values, and local variables** just like functions in a programming language. ANTLR **collects all of the variables you define and stores them in the rule context object**. These variables are usually called **attributes**. 

Here’s the general syntax showing all possible attribute definition locations:

```
rulename[args] returns [retvals] locals [localvars] : ... ;
```

The attributes defined within those [...] can be used like any other variable. Here is a sample rule that copies parameters to return values:

```
// Return the argument plus the integer value of the INT token
add[int x] returns [int result] : '+=' INT {$result = $x + $INT.int;} ;
```

The args, locals, and return `[...]` are generally in the target language but **with some constraints**. The `[...]` string is a comma-separated list of declarations either with prefix or postfix type notation or no-type notation. The elements can have initializer such as `[int x = 32, float y]` but don't go too crazy as we are parsing this generic text manually in [ScopeParser](https://github.com/antlr/antlr4/blob/master/tool/src/org/antlr/v4/parse/ScopeParser.java).

#### rule-level named actions

As with the grammar level, you can specify rule-level named actions. For rules, the valid names are **`init` and `after`.** As the names imply, parsers execute init actions immediately before trying to match the associated rule and execute after actions immediately after matching the rule. 

ANTLR after actions do not execute as part of the finally code block of the generated rule function. Use the ANTLR finally action to place code in the generated rule function finally code block.

The actions come after any argument, return value, or local attribute definition actions. The `row` rule preamble from Section 10.2, Accessing Token and Rule Attributes illustrates the syntax nicely: actions/CSV.g4

```
/** Derived from rule "row : field (',' field)* '\r'? '\n' ;" */
row[String[] columns]
   returns [Map<String,String> values]
   locals [int col=0]
	@init {
	$values = new HashMap<String,String>();
	}
	@after {
	if ($values!=null && $values.size()>0) {
	System.out.println("values = "+$values);
	}
	**}**：...
	;
```

Rule row takes argument columns, returns values, and defines local variable col. The “actions” in square brackets are copied directly into the generated code. The generated rule functions also specify the rule arguments as function arguments, but they are quickly copied into the local RowContext object:

```
public class CSVParser extends Parser {
	...
	public static class RowContext extends ParserRuleContext {
		public String [] columns;
		public Map<String,String> values;
		public int col=0;
		...
		public final RowContext row(String [] columns) throws RecognitionException {
	 	RowContext _localctx = new RowContext(_ctx, 4, columns);
	 	enterRule(_localctx, RULE_row);
	 	...
 		}
	}
	...
}
```

ANTLR tracks nested `[...]` within the action so that `String[]` columns is parsed properly. It also tracks angle brackets so that commas within generic type parameters do not signify the start of another attribute. `Map<String,String>` values is one attribute definition.

There can be multiple attributes in each action, even for return values. Use a comma to separate attributes within the same action:

```
a[Map<String,String> x, int y] : ... ;
```

ANTLR interprets that action to define two arguments, x and y:

```
public final AContext a(Map<String,String> x, int y)
	throws RecognitionException
{
	AContext _localctx = new AContext(_ctx, 0, x, y);
	enterRule(_localctx, RULE_a);
	...
}
```

### Start Rules and EOF

A start rule is the rule engaged first by the parser; it’s the rule function called by the language application. **Any** rule in the grammar can act as a start rule.

Start rules don’t necessarily consume all of the input. They consume **only as much input as needed** to match an alternative of the rule. For example, consider the following rule that matches one, two, or three tokens, depending on the input.

```
s : ID
  | ID '+'
  | ID '+' INT
  ;
```

Upon `a+3`, rule `s` matches the third alternative. Upon `a+b`, it matches the second alternative and ignores the final `b` token. Upon `a b`, it matches the first alternative, ignoring the `b` token. The parser does not consume the complete input in the latter two cases because rule `s` doesn’t explicitly say that end of file must occur after matching an alternative of the rule.

On the other hand, **rules that describe entire input files should reference special predefined-token `EOF`.** If they don’t, you might scratch your head for a while wondering why the start rule doesn’t report errors for any input no matter what you give it. Here’s a rule that’s part of a grammar for reading configuration files:

```
config : element*; // can "match" even with invalid input.
```

Invalid input would cause `config` to return immediately without matching any input and without reporting an error. Here’s the proper specification:

```
file : element* EOF; // don't stop early. must match all input
```

## Left-recursive rules

The most natural expression of some common language constructs is left recursive. Unfortunately, left recursive specifications of arithmetic expressions are typically **ambiguous** but much easier to write out than the multiple levels required in a typical top-down grammar. Here is a sample ANTLR 4 grammar with a left recursive expression rule:

```
stat: expr '=' expr ';' // e.g., x=y; or x=f(x);
    | expr ';'          // e.g., f(x); or f(g(x));
    ;
expr: expr '*' expr
    | expr '+' expr
    | expr '(' expr ')' // f(x)
    | id
    ;
```

In straight context free grammars, such a rule is ambiguous because 1+2*3 it can interpret either operator as occurring first, but ANTLR rewrites that to be non-left recursive and unambiguous using **semantic predicates**:

```
expr[int pr] : id
               ( {4 >= $pr}? '*' expr[5]
               | {3 >= $pr}? '+' expr[4]
               | {2 >= $pr}? '(' expr[0] ')'
               )*
             ;
```


The predicates resolve ambiguities by comparing the precedence of the current operator against the precedence of the previous operator. An expansion of expr[pr] can match only those subexpressions whose precedence meets or exceeds pr.

### Formal rules

The formal 4.0, 4.1 ANTLR left-recursion elimination rules were changed (simplified) for 4.2 and are laid out in the [ALL(*) tech report](http://www.antlr.org/papers/allstar-techreport.pdf):

- Binary expressions are expressions which contain a recursive invocation of the rule as the first and last element of the alternative.
- Suffix expressions contain a recursive invocation of the rule as the first element of the alternative, but not as the last element.
- Prefix expressions contain a recursive invocation of the rule as the last element of the alternative, but not as the first element.

There is no such thing as a "ternary" expression--they are just binary expressions in disguise.

The right associativity specifiers used to be on the individual tokens but it's done on alternative basis anyway so the option is now on the individual alternative; e.g.,

```
e : e '*' e
  | e '+' e
  |<assoc=right> e '?' e ':' e
  |<assoc=right> e '=' e
  | INT
  ;
```

If your 4.0 or 4.1 grammar uses a right-associative ternary operator, you will need to update your grammar to include `<assoc=right>` on the alternative operator. To smooth the transition, `<assoc=right>` is still allowed on token references but it is ignored.

## Actions and Attributes

Actions are blocks of text written in the target language and enclosed in curly braces. The recognizer triggers them according to their locations within the grammar. For example, the following rule emits "found a decl" after the parser has seen a valid declaration:

```
decl: type ID ';' {System.out.println("found a decl");} ;
type: 'int' | 'float' ;
```

Most often, actions access the attributes of tokens and rule references:

```
decl: type ID ';'
      {System.out.println("var "+$ID.text+":"+$type.text+";");}
    | t=ID id=ID ';'
      {System.out.println("var "+$id.text+":"+$t.text+";");}
    ;
```

### Token Attributes

All tokens have a collection of predefined, read-only **attributes**. The attributes include useful token **properties** such as the token type and text matched for a token. Actions can access these attributes via `$label.attribute` where label labels a particular instance of a token reference (`a` and `b` in the example below are used in the action code as `$a` and `$b`). Often, a particular token is only referenced once in the rule, in which case the token name itself can be used unambiguously in the action code (token `INT` can be used as `$INT` in the action). The following example illustrates token attribute expression syntax:

```
r : INT {int x = $INT.line;}
    ( ID {if ($INT.line == $ID.line) ...;} )?
    a=FLOAT b=FLOAT {if ($a.line == $b.line) ...;}
  ;
```

The action within the `(...)?` subrule can see the `INT` token matched before it in the outer level.

Because there are two references to the `FLOAT` token, a reference to `$FLOAT` in an action is not unique; you must use labels to specify which token reference you’re interested in.

Token references within different alternatives are unique because only one of them can be matched for any invocation of the rule. For example, in the following rule, actions in both alternatives can reference `$ID` directly without using a label:

```
 	r : ... ID {System.out.println($ID.text);}
 	| ... ID {System.out.println($ID.text);}
 	;
```

To access the tokens matched for literals, you must use a label:

```
 	stat: r='return' expr ';' {System.out.println("line="+$r.line);} ;
```

Most of the time you access the attributes of the token, but sometimes it is useful to access the Token object itself because it aggregates all the attributes. Further, you can use it to test whether an optional subrule matched a token:

```
 	stat: 'if' expr 'then' stat (el='else' stat)?
 	{if ( $el!=null ) System.out.println("found an else");}
 	| ...
 	;
```

`$T` and `$L` evaluate to `Token` objects for token name `T` and token label `L`. `$ll` evaluates to `List<Token>` for list label `ll`. `$T.attr` evaluates to the type and value specified in the following table for attribute `attr`:

| Attribute | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| text      | String | The text matched for the token; translates to a call to getText. Example: $ID.text. |
| type      | int    | The token type (nonzero positive integer) of the token such as INT; translates to a call to getType. Example: $ID.type. |
| line      | int    | The line number on which the token occurs, counting from 1; translates to a call to getLine. Example: $ID.line. |
| pos       | int    | The character position within the line at which the token’s first character occurs counting from zero; translates to a call to getCharPositionInLine. Example: $ID.pos. |
| index     | int    | The overall index of this token in the token stream, counting from zero; translates to a call to getTokenIndex. Example: $ID.index. |
| channel   | int    | The token’s channel number. The parser tunes to only one channel, effectively ignoring off-channel tokens. The default channel is 0 (Token.DEFAULT_CHANNEL), and the default hidden channel is Token.HIDDEN_CHANNEL. Translates to a call to getChannel. Example: $ID.channel. |
| int       | int    | The integer value of the text held by this token; it assumes that the text is a valid numeric string. Handy for building calculators and so on. Translates to Integer.valueOf(text-of-token). Example: $INT.int. |

### Parser Rule Attributes

ANTLR predefines a number of read-only attributes associated with parser rule references that are available to actions. Actions can access rule attributes only for references that precede the action. The syntax is `$r.attr` for rule name `r` or a label assigned to a rule reference. For example, `$expr.text` returns the complete text matched by a preceding invocation of rule `expr`:

```
returnStat : 'return' expr {System.out.println("matched "+$expr.text);} ;
```

Using a rule label looks like this:

```
returnStat : 'return' e=expr {System.out.println("matched "+$e.text);} ;
```

You can also use `$` followed by the name of the attribute to access the value associated with the currently executing rule. For example, `$start` is the starting token of the current rule.

```
returnStat : 'return' expr {System.out.println("first token "+$start.getText());} ;
```

`$r` and `$rl` evaluate to `ParserRuleContext` objects of type `RContext` for rule name `r` and rule label `rl`. `$rll` evaluates to `List<RContext>` for rule list label `rll`. `$r.attr` evaluates to the type and value specified in the following table for attribute `attr`:

| Attribute | Type              | Description                                                  |
| --------- | ----------------- | ------------------------------------------------------------ |
| text      | String            | The **text matched** for a rule or the text matched from the start of the rule up until the point of the `$text` expression evaluation. Note that this includes the text for all tokens including those on hidden channels, which is what you want because usually that has all the whitespace and comments. When referring to the current rule, this attribute is available in any action including any exception actions. |
| start     | Token             | The **first token** to be potentially matched by the rule that is on the main token channel; in other words, this attribute is never a hidden token. For rules that end up matching no tokens, this attribute points at the first token that could have been matched by this rule. When referring to the current rule, this attribute is available to any action within the rule. |
| stop      | Token             | The last nonhidden channel token to be matched by the rule. When referring to the current rule, this attribute is available only to the after and finally actions. |
| ctx       | ParserRuleContext | The rule context object associated with a rule invocation. All of the other attributes are available through this attribute. For example, `$ctx.start` accesses the start field within the current rules context object. It’s the same as `$start`. |
| parser    | Parser            | The parser itself. This attribute can be used, for example, to invoke a method defined in the parser's `@members` section from a semantic predicate. |

### Dynamically-Scoped Attributes

You can pass information to and from rules using parameters and return values, just like functions in a general-purpose programming language. Programming languages don’t allow functions to access the local variables or parameters of invoking functions, however. For example, the following reference to local variable `x` form a nested method call is illegal in Java:

```
void f() {
	int x = 0;
	g();
}
void g() {
	h();
}
void h() {
	int y = x; // INVALID reference to f's local variable x
}
```

Variable `x` is available only within the scope of `f`, which is the text lexically delimited by curly brackets. For this reason, Java is said to use lexical scoping. Lexical scoping is the norm for most programming languages. Languages that allow methods further down in the call chain to access local variables defined earlier are said to use dynamic scoping. The term dynamic refers to the fact that a compiler cannot statically determine the set of visible variables. This is because the set of variables visible to a method changes depending on who calls that method.

It turns out that, in the grammar realm, distant rules sometimes need to communicate with each other, mostly to provide context information to rules matched below in the rule invocation chain. (Naturally, this assumes that you are using actions directly in the grammar instead of the parse-tree listener event mechanism.) ANTLR allows dynamic scoping in that actions can access attributes from invoking rules using syntax `$r::x` where `r` is a rule name and `x` is an attribute within that rule. It is up to the programmer to ensure that `r` is in fact an invoking rule of the current rule. A runtime exception occurs if `r` is not in the current call chain when you access `$r::x`.

To illustrate the use of dynamic scoping, consider the real problem of defining variables and ensuring that variables in expressions are defined. The following grammar defines the symbols attribute where it belongs in the block rule but adds variable names to it in rule `decl`. Rule `stat` then consults the list to see whether variables have been defined.

```
grammar DynScope;
 
prog: block ;
 
block
	/* List of symbols defined within this block */
	locals [
	List<String> symbols = new ArrayList<String>()
	**]**：'{' decl* stat+ '}'
	// print out all symbols found in block
	// $block::symbols evaluates to a List as defined in scope
	{System.out.println("symbols="+$symbols);}
	;
 
/** Match a declaration and add identifier name to list of symbols */
decl: 'int' ID {$block::symbols.add($ID.text);} ';' ;
 
/** Match an assignment then test list of symbols to verify
 * that it contains the variable on the left side of the assignment.
 * Method contains() is List.contains() because $block::symbols
 * is a List.
 */
stat: ID '=' INT ';'
	{
	if ( !$block::symbols.contains($ID.text) ) {
	System.err.println("undefined variable: "+$ID.text);
	}
	}
	| block
	;
 
ID : [a-z]+ ;
INT : [0-9]+ ;
WS : [ \t\r\n]+ -> skip ;
```

Here’s a simple build and test sequence:

```
$ antlr4 DynScope.g4
$ javac DynScope*.java
$ grun DynScope prog
=> 	{
=> 	int i;
=> 	i = 0;
=> 	j = 3;
=> 	}
=> 	EOF
<= 	undefined variable: j
 	symbols=[i]
```

There’s an important difference between a simple field declaration in a `@members` action and dynamic scoping. symbols is a local variable and so there is a copy for each invocation of rule `block`. That’s exactly what we want for nested blocks so that we can reuse the same input variable name in an inner block. For example, the following nested code block redefines `i` in the inner scope. This new definition must hide the definition in the outer scope.

```
{
	int i;
	int j;
	i = 0;
	{
		int i;
		int x;
		x = 5;
	}
	x = 3;
}
```

Here’s the output generated for that input by DynScope:

```
$ grun DynScope prog nested-input
symbols=[i, x]
undefined variable: x
symbols=[i, j]
```

Referencing `$block::symbols` accesses the `symbols` field of the most recently invoked `block`’s rule context object. If you need access to a symbols instance from a rule invocation farther up the call chain, you can walk backwards starting at the current context, `$ctx`. Use `getParent` to walk up the chain.

## Parse Tree Listeners

By default, ANTLR-generated parsers build a data structure called a parse tree or syntax tree that records how the parser recognized the structure of the input sentence and component phrases.

The interior nodes of the parse tree are **phrase names** that **group and identify their children**. The root node is the **most abstract** phrase name. The leaves of a parse tree are always the **input tokens**. 

Parse trees sit between a language recognizer and an interpreter or translator implementation. They are extremely effective data structures because they contain all of the input and complete knowledge of **how** the parser grouped the symbols into phrases. Better yet, they are easy to understand and the parser generates them **automatically** (unless you turn them off with `parser.setBuildParseTree(false)`).

Because we specify phrase structure with a set of rules, parse tree subtree roots **correspond to grammar rule names**. 

ANTLR has a **ParseTreeWalker** that knows how to walk these parse trees and trigger events in listener implementation objects that you can create. The ANTLR tool generates listener interfaces for you also, **unless you turn that off** with a commandline option. You can also have it generate **visitors**. 

For example from a Java.g4 grammar, ANTLR generates:

```java
public interface JavaListener extends ParseTreeListener<Token> {
  void enterClassDeclaration(JavaParser.ClassDeclarationContext ctx);
  void exitClassDeclaration(JavaParser.ClassDeclarationContext ctx);
  void enterMethodDeclaration(JavaParser.MethodDeclarationContext ctx);
 ...
}
```

where there is an **enter and exit method** for **each rule** in the parser grammar. 

ANTLR also generates **a base listener with empty implementations** of all listener interface methods, in this case called JavaBaseListener. You can build your listener by subclassing this base and overriding the methods of interest.

Assuming you've created a listener object called `MyListener`, here is how to call the Java parser and walk the parse tree:

```java
JavaLexer lexer = new JavaLexer(input);
CommonTokenStream tokens = new CommonTokenStream(lexer);
JavaParser parser = new JavaParser(tokens);
JavaParser.CompilationUnitContext tree = parser.compilationUnit(); // parse a compilationUnit

MyListener extractor = new MyListener(parser);
ParseTreeWalker.DEFAULT.walk(extractor, tree); // initiate walk of tree with listener in use of default walker
```

Listeners and visitors are great because they **keep application-specific code out of grammars**, making grammars easier to read and preventing them from getting entangled with a particular application.

The biggest difference between the listener and visitor mechanisms is that **listener methods are called independently by an ANTLR-provided walker object**, whereas **visitor methods must walk their children with explicit visit calls**. Forgetting to invoke visitor methods on a node’s children, means those subtrees don’t get visited.

### Listening during the parse

We can also use listeners to execute code **during the parse** instead of waiting for a tree walker walks the resulting parse tree. Let's say we have the following simple expression grammar.

```
grammar CalcNoLR;

s : expr EOF ;

expr:	add ((MUL | DIV) add)* ;

add :   atom ((ADD | SUB) atom)* ;

atom : INT ;

INT : [0-9]+;
MUL : '*';
DIV : '/';
ADD : '+';
SUB : '-';
WS : [ \t]+ -> channel(HIDDEN);
```

We can create a listener that executes during the parse by implementing the listener interface as before:

```
class CountListener extends CalcNoLRBaseListener {
	public int nums = 0;
	public boolean execExitS = false;

	@Override
	public void exitS(CalcNoLRParser.SContext ctx) {
		execExitS = true;
	}

	@Override
	public void exitAtom(CalcNoLRParser.AtomContext ctx) {
		nums++;
	}
}
```

And then passing it to `addParseListener()`:

```
String input = "2 + 8 / 2";
CalcNoLRLexer lexer = new CalcNoLRLexer(new ANTLRInputStream(input));
CalcNoLRParser parser = new CalcNoLRParser(new CommonTokenStream(lexer));
CountListener counter = new CountListener();
parser.addParseListener(counter);

// Check that the purses valid first
CalcNoLRParser.SContext context = parser.s();
String parseTreeS = context.toStringTree(parser);
assertEquals("(s (expr (add (atom 2) + (atom 8)) / (add (atom 2))) <EOF>)", parseTreeS);
assertEquals(3, counter.nums);
assertEquals(true, counter.execExitS);
```

One should not do very complicated work during the parse because the parser is throwing exception to handle syntax errors. If you're complicated code throws different kind of exception it will screw up the parsing and things will go nuts. If you want to catch and properly handle exceptions in your listener code during the parse, you should override this method from `Parser`:

```
protected boolean listenerExceptionOccurred = false;

/**
 * Notify any parse listeners of an exit rule event.
 *
 * @see #addParseListener
 */
@override
protected void triggerExitRuleEvent() {
	if ( listenerExceptionOccurred ) return;
	try {
		// reverse order walk of listeners
		for (int i = _parseListeners.size() - 1; i >= 0; i--) {
			ParseTreeListener listener = _parseListeners.get(i);
			_ctx.exitRule(listener);
			listener.exitEveryRule(_ctx);
		}
	}
	catch (Throwable e) {
		// If an exception is thrown in the user's listener code, we need to bail out
		// completely out of the parser, without executing anymore user code. We
		// must also stop the parse otherwise other listener actions will attempt to execute
		// almost certainly with invalid results. So, record the fact an exception occurred
		listenerExceptionOccurred = true;
		throw e;
	}
}
```

Now, if you throw an exception inside one of the listener methods:

```
// Now throw an exception in the listener
class ErrorListener extends CalcNoLRBaseListener {
	public boolean execExitS = false;
	public boolean execExitAtom = false;

	@Override
	public void exitS(CalcNoLRParser.SContext ctx) {
		execExitS = true;
	}

	@Override
	public void exitAtom(CalcNoLRParser.AtomContext ctx) {
		execExitAtom = true;
		throw new NullPointerException("bail out");
	}
}
```

then the exception will properly cause the parser to bailout and the exception will not be thrown out:

```
java.lang.NullPointerException: bail out

	at org.antlr.v4.test.runtime.java.api.TestParseListener$2ErrorListener.exitAtom(TestParseListener.java:102)
	at org.antlr.v4.test.runtime.java.api.CalcNoLRParser$AtomContext.exitRule(CalcNoLRParser.java:311)
	at org.antlr.v4.runtime.Parser.triggerExitRuleEvent(Parser.java:412)
	at org.antlr.v4.runtime.Parser.exitRule(Parser.java:654)
	at org.antlr.v4.test.runtime.java.api.CalcNoLRParser.atom(CalcNoLRParser.java:336)
	at org.antlr.v4.test.runtime.java.api.CalcNoLRParser.add(CalcNoLRParser.java:261)
	at org.antlr.v4.test.runtime.java.api.CalcNoLRParser.expr(CalcNoLRParser.java:181)
	at org.antlr.v4.test.runtime.java.api.CalcNoLRParser.s(CalcNoLRParser.java:123)
```

## Semantic Predicates

Semantic predicates, `{...}?`, are **boolean expressions** written in the target language that indicate the validity of continuing the parse along the path "guarded" by the predicate. **Predicates can appear anywhere within a parser rule just like actions can**, but only those appearing on the left edge of alternatives can affect prediction (choosing between alternatives). This section provides all of the fine print regarding the use of semantic predicates in parser and lexer rules. Let's start out by digging deeper into how the parser incorporates predicates into parsing decisions.

### Making Predicated Parsing Decisions

ANTLR's general decision-making strategy is to find all viable alternatives and then ignore the alternatives guarded with predicates that currently evaluate to false. (A viable alternative is one that matches the current input.) If more than one viable alternative remains, the parser chooses the alternative specified first in the decision.

Consider a variant of C++ where array references also use parentheses instead of square brackets. If we only predicate one of the alternatives, we still have an ambiguous decision in expr:

```
expr: ID '(' expr ')' // array reference (ANTLR picks this one)
 	| {istype()}? ID '(' expr ')' // ctor-style typecast
 	| ID '(' expr ')' // function call
 	;
```

In this case, all three alternatives are viable for input `x(i)`. When `x` is not a type name, the predicate evaluates to false, leaving only the first and third alternatives as possible matches for expr. ANTLR automatically chooses the first alternative matching the array reference to resolve the ambiguity. Leaving ANTLR with more than one viable alternative because of too few predicates is probably not a good idea. It's best to cover n viable alternatives with at least n-1 predicates. In other words, don't build rules like expr with too few predicates.

Sometimes, the parser finds multiple visible predicates associated with a single choice. No worries. ANTLR just combines the predicates with appropriate logical operators to conjure up a single meta-predicate on-the-fly.

For example, the decision in rule `stat` joins the predicates from both alternatives of expr with the `||` operator to guard the second stat alternative:

```
stat: decl | expr ;
decl: ID ID ;
expr: {istype()}? ID '(' expr ')' // ctor-style typecast
 	| {isfunc()}? ID '(' expr ')' // function call
 	;
```

The parser will only predict an expr from stat when `istype()||isfunc()` evaluates to true. This makes sense because the parser should only choose to match an expression if the upcoming `ID` is a type name or function name. It wouldn't make sense to just test one of the predicates in this case. Note that, when the parser gets to `expr` itself, the parsing decision tests the predicates individually, one for each alternative.

If multiple predicates occur in a sequence, the parser joins them with the `&&` operator. For example, consider changing `stat` to include a predicate before the call `toexpr`:

```
stat: decl | {java5}? expr ;
```

Now, the parser would only predict the second alternative if `java5&&(istype()||isfunc())` evaluated to true.

Turning to the code inside the predicates themselves now, keep in mind the following guidelines.

Even when the parser isn't making decisions, predicates can deactivate alternatives, causing rules to fail. This happens when a rule only has a single alternative. There is no choice to make, but ANTLR evaluates the predicate as part of the normal parsing process, just like it does for actions. That means that the following rule always fails to match.

```
prog: {false}? 'return' INT ; // throws FailedPredicateException
```

ANTLR converts `{false}?` in the grammar to a conditional in the generated parser:

```
if ( !false ) throw new FailedPredicateException(...);
```

So far, all of the predicates we've seen have been visible and available to the prediction process, but that's not always the case.

### Finding Visible Predicates

The parser will not evaluate predicates during prediction that occur after an action or token reference. Let's think about the relationship between actions and predicates first.

ANTLR has no idea what's inside the raw code of an action and so it must assume any predicate could depend on side effects of that action. Imagine an action that computed value `x` and a predicate that tested `x`. Evaluating that predicate before the action executed to create `x` would violate the implied order of operations within the grammar.

More importantly, the parser can't execute actions until it has decided which alternative to match. That's because actions have side effects and we can't undo things like print statements. For example, in the following rule, the parser can't execute the action in front of the `{java5}?` predicate before committing to that alternative.

```
@members {boolean allowgoto=false;}
stat: {System.out.println("goto"); allowgoto=true;} {java5}? 'goto' ID ';'
 	| ...
 	;
```

If we can't execute the action during prediction, we shouldn't evaluate the `{java5}?` predicate because it depends on that action.

The prediction process also can't see through token references. Token references have the side effect of advancing the input one symbol. A predicate that tested the current input symbol would find itself out of sync if the parser shifted it over the token reference. For example, in the following grammar, the predicates expect `getCurrentToken` to return an `ID` token.

```
stat: '{' decl '}'
 	| '{' stat '}'
 	;
decl: {istype(getCurrentToken().getText())}? ID ID ';' ;
expr: {isvar(getCurrentToken().getText())}? ID ;
```

The decision in stat can't test those predicates because, at the start of stat, the current token is a left curly. To preserve the semantics, ANTLR won't test the predicates in that decision.

Visible predicates are those that prediction encounters before encountering an action or token. The prediction process ignores nonvisible predicates, treating them as if they don't exist.

In rare cases, the parser won't be able to use a predicate, even if it's visible to a particular decision. That brings us to our next fine print topic.

### Using Context-Dependent Predicates

A predicate that depends on a parameter or local variable of the surrounding rule, is considered a context-dependent predicate. Clearly, we can only evaluate such predicates within the rules in which they're defined. For example, it makes no sense for the decision in prog below to test context-dependent predicate `{$i<=5}?`. That `$i` local variable is not even defined in `prog`.

```
prog: vec5
 	| ...
 	;
vec5
**locals [int i=1]**：( {$i<=5}? INT {$i++;} )* // match 5 INTs
 	;
```

ANTLR ignores context-dependent predicates that it can't evaluate in the proper context. Normally the proper context is simply the rule defining the predicate, but sometimes the parser can't even evaluate a context-dependent predicate from within the same rule! Detecting these cases is done on-the-fly at runtime during adaptive LL(*) prediction.

For example, prediction for the optional branch of the else subrule in stat below "falls off" the end of stat and continues looking for symbols in the invoking prog rule.

```
prog: stat+ ; // stat can follow stat
stat
**locals [int i=0]**：{$i==0}? 'if' expr 'then' stat {$i=5;} ('else' stat)?
 	| 'break' ';'
 	;
```

The prediction process is trying to figure out what can follow an if statement other than an else clause. Since the input can have multiple stats in a row, the prediction for the optional branch of the else subrule reenters stat. This time, of course, it gets a new copy of `$i` with a value of 0, not 5. ANTLR ignores context-dependent predicate `{$i==0}?` because it knows that the parser isn't in the original stat call. The predicate would test a different version of `$i` so the parser can't evaluate it.

The fine print for predicates in the lexer more or less follow these same guidelines, except of course lexer rules can't have parameters and local variables. Let's look at all of the lexer-specific guidelines in the next section.

### Predicates in Lexer Rules

In parser rules, predicates must appear on the left edge of alternatives to aid in alternative prediction. Lexers, on the other hand, prefer predicates on the right edge of lexer rules because they choose rules after seeing a token's entire text. Predicates in lexer rules can technically be anywhere within the rule. Some positions might be more or less efficient than others; ANTLR makes no guarantees about the optimal spot. A predicate in a lexer rule might be executed multiple times even during a single token match. You can embed multiple predicates per lexer rule and they are evaluated as the lexer reaches them during matching.

Loosely speaking, the lexer's goal is to choose the rule that matches the most input characters. At each character, the lexer decides which rules are still viable. Eventually, only a single rule will be still viable. At that point, the lexer creates a token object according the rule's token type and matched text.

Sometimes the lexer is faced with more than a single viable matching rule. For example, input enum would match an `ENUM` rule and an `ID` rule. If the next character after enum is a space, neither rule can continue. The lexer resolves the ambiguity by choosing the viable rule specified first in the grammar. That's why we have to place keyword rules before an identifier rule like this:

```
ENUM : 'enum' ;
ID : [a-z]+ ;
```

If, on the other hand, the next character after input `enum` is a letter, then only `ID` is viable.

Predicates come into play by pruning the set of viable lexer rules. When the lexer encounters a false predicate, it deactivates that rule just like parsers deactivate alternatives with false predicates.

Like parser predicates, lexer predicates can't depend on side effects from lexer actions. That said, the predicate can depend on a side effect of an action that occured during the recognition of the previous token. That's because actions can only execute after the lexer positively identifies the rule to match. Since predicates are part of the rule selection process, they can't rely on action side effects created by actions in currently-prospective rules. Lexer actions must appear after predicates in lexer rules. As an example, here's another way to match enum as a keyword in the lexer:

```
ENUM: [a-z]+ {getText().equals("enum")}?
	   {System.out.println("enum!");}
    ;
ID  : [a-z]+ {System.out.println("ID "+getText());} ;
```

The print action in `ENUM` appears last and executes only if the current input matches `[a-z]+` and the predicate is true. Let's build and test `Enum3` to see if it distinguishes between enum and an identifier:

```
$ antlr4 Enum3.g4
$ javac Enum3.java
$ grun Enum3 tokens
=> 	enum abc
=> 	EOF
<= 	enum!
 	ID abc
```

That works great, but it's really just for instructional purposes. It's easier to understand and more efficient to match enum keywords with a simple rule like this:

```
ENUM : 'enum' ;
```

Here's another example of a predicate. It's important to note that the predicate is evaluated before the action because actions are only executed if the lexer rule matches. The actions are not executed in line; they are collected and executed en mass later.

```
INDENT : [ \t]+ {System.out.println("INDENT")>} {this.getCharPositionInLine()==0}? ;
```

For more information on how actions and predicates operate in the lexer, see [Lexer actions and semantic predicates are executed out of order](https://github.com/antlr/antlr4/issues/3611) and [Lexer.getCharIndex() return value not behaving as expected](https://github.com/antlr/antlr4/issues/3606). The lexer rule that will not work as expected is:

```
Stuff : ( 'a'+ {count++;} | 'b') 'c' 'd' {count == 3}? ;
```

The `count++` code we'll not execute until after `Stuff` has been recognized (assuming count!=3).

## 华为云

一般如果语法非常复杂，会基于Lexer和Parser写到两个不同的文件中（例如Java，可参考：https://github.com/antlr/grammars-v4/tree/master/java/java8），如果语法比较简单，可以只写到一个文件中（例如Lua，可参考：https://github.com/antlr/grammars-v4/blob/master/lua/Lua.g4）。

Antlr4**整体结构**如下：

```javascript
/** Optional javadoc style comment */

grammar Name;

options {...}

import ... ;
tokens {...}

channels {...} // lexer only

@actionName {...}
rule1 // parser and lexer rules, possibly intermingled

...

ruleN
```

**替代标签**

通过在语句后面，添加 #替代标签，可以将语句转换为这些替代标签，从而加以区分

**结合性**

默认情况下，ANTLR从左到右结合运算符，然而某些像指数群这样的运算符则是从右到左。可以使用选项assoc手动指定运算符记号上的相关性。

实际上，Antlr4 已经对一些常用的操作符的优先级进行了处理，例如加减乘除等，这些就不需要再特殊处理

**通道**

很多信息，例如注释、空格等，是结果信息生成不需要处理的，但是我们又不适合直接丢弃，安全地忽略掉注释和空格的方法是把这些发送给语法分析器的记号放到一个“隐藏通道”中，语法分析器仅需要调协到单个通道即可。我们可以把任何我们想要的东西传递到其它通道中。

