---
title: 【Base64】Encoding
date: 2024-09-30 00:00:00+0000
categories: 
    - nutrition
---

## Base64 Encoding

Base64 is a **binary-to-text** encoding scheme that converts binary data into a set of 64 characters. Here's a brief overview:

1. Purpose: It's used to represent binary data using a limited set of printable ASCII characters, making it safer to transmit or store data in environments that only support text.

2. Character set: Base64 uses A-Z, a-z, 0-9, and typically '+' and '/' (with '=' for padding).

3. Process: 
   - Takes 3 bytes (24 bits) of binary data
   - Divides it into 4 groups of 6 bits each
   - Converts each group to its corresponding Base64 character

4. Common uses:
   - Encoding binary data in email attachments
   - Storing complex data in JSON
   - Embedding image data in CSS or HTML

5. Advantages:
   - Ensures data integrity during transfer
   - Allows binary data to be treated as text

6. Disadvantages:
   - Increases data size by about **33%** (3byte to 4byte)
   - Not designed for encryption (it's an encoding, not encryption)

Would you like me to elaborate on any specific aspect of Base64 encoding?

## Why it is preferred

1. ASCII compatibility:
   - ASCII defines 128 characters, but only 95 of them are printable.
   - Base64 uses 64 characters, which are all **printable and common** across different systems.

2. 2^6 efficiency:
   - 64 is 2^6, which **aligns perfectly** with binary data (multiples of 8 bits 6x4=3x8).
   - This allows efficient conversion between binary and Base64 without wasting bits.

3. Avoiding special characters:
   - Base64 mostly uses **alphanumeric** characters, which are safe in most contexts.
   - Higher bases would require more special characters, increasing the risk of conflicts.

4. URL and filename safety:
   - The standard Base64 character set is mostly **safe for URLs and filenames**.
   - Minor **variants** (like Base64URL) make it completely safe for these uses.

5. Historical reasons:
   - Base64 emerged when 6-bit character codes were common in early computing.
   - It became a standard and has remained widely supported.

6. Tradeoffs with higher bases:
   - Base128 would require 7 bits per character, not aligning well with 8-bit bytes.
   - It would also require using many more special characters or non-printable ASCII characters.

7. Lower bases comparison:
   - Base32 exists but increases size more than Base64.
   - Base16 (hexadecimal) is simple but doubles the data size.

While Base64 does increase data size, it **strikes a balance** between efficiency, compatibility, and safety that has made it a lasting standard in data encoding.

## Comparison With Base64URL

Base64 and Base64URL (also known as URL-safe Base64) are very similar encoding schemes, but they have a few key differences designed to make Base64URL safe for use in URLs and filenames. Here's a comparison:

1. Character set:
   - Base64: Uses A-Z, a-z, 0-9, **+, and /**
   - Base64URL: Uses A-Z, a-z, 0-9, **-, and _**

2. Padding:
   - Base64: Uses = for padding
   - Base64URL: Often omits padding, though some implementations may keep it

3. Main differences:
   - Base64URL replaces + with -
   - Base64URL replaces / with _
   - Base64URL often omits the = padding

4. Purpose:
   - Base64: General-purpose encoding for binary data
   - Base64URL: Specifically designed for use in URLs and filenames

5. URL safety:
   - Base64: Can cause issues in URLs due to +, /, and = characters
   - Base64URL: Safe for use in URLs without escaping

6. Example:
   Original: Hello World!
   Base64:    SGVsbG8gV29ybGQh
   Base64URL: SGVsbG8gV29ybGQh (in this case, they're the same)

   Original: Subject?
   Base64:    U3ViamVjdD8=
   Base64URL: U3ViamVjdD8 (note: padding removed)

7. Compatibility:
   - Most Base64 decoders can handle Base64URL input
   - The reverse is not always true

8. Usage contexts:
   - Base64: Email attachments, general data encoding
   - Base64URL: URL parameters, JWT tokens, filenames

9. Conversion:
   To convert Base64 to Base64URL:
   
   - Replace + with -
   - Replace / with _
   - Remove = padding (optional, depending on implementation)

While the differences are small, they're crucial for ensuring that encoded data can be safely used in URL contexts without requiring additional escaping or causing parsing issues. In most other respects, the two encodings function identically.

## Data URL

Data URLs are a way to embed small files directly into web pages or CSS, and Base64 encoding plays a crucial role in this. Here's an overview of Base64 usage in data URLs:

1. Purpose:
   - Data URLs allow embedding file data directly in web pages or stylesheets.
   - They eliminate the need for separate HTTP requests for small resources.

2. Structure:
   - Format: `data:[<media type>][;base64],<encoded data>`
   - Example: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==`

3. Base64 role:
   - Binary data (like images) is encoded to Base64 to fit in the URL-safe text format.
   - This allows binary content to be included directly in HTML or CSS.

4. Common uses:
   - Small images (icons, logos)
   - Custom fonts
   - Small audio or video files
   - Any small file where reducing HTTP requests is beneficial

5. Advantages:
   - Reduces HTTP requests, potentially improving load times
   - Useful for resources that change frequently
   - Simplifies deployment by bundling resources with code

6. Disadvantages:
   - Increases file size due to Base64 encoding overhead
   - Not cached separately by the browser
   - Can make HTML or CSS files larger and harder to read

7. Best practices:
   - Generally recommended for very small files (usually < 1-2 KB)
   - For larger files, conventional URLs are usually more efficient

8. Example usage in HTML:
   ```html
   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==" alt="Small dot">
   ```

9. Example usage in CSS:
   ```css
   .icon {
     background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==');
   }
   ```

Data URLs with Base64 encoding provide a way to embed resources directly in web documents, offering a trade-off between reducing HTTP requests and increasing document size. They're particularly useful for small, frequently changing resources in web development.

### Why not Base64URL

- Data URLs are already part of a URL structure, so URL-safety is not a concern.
- The data portion is treated as an opaque blob, not as part of the URL syntax.