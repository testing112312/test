# HTTP REQUESTS 

### Defined
HTTP stands for Hypertext Transfer Protocol. It's a fundamental protocol used for transmitting data over the internet. Here are the key points about HTTP:
- Purpose: It facilitates communication between web browsers and web servers.
- Function: HTTP defines how messages are formatted and transmitted between web clients (usually browsers) and servers.
- Stateless protocol: Each request is independent and doesn't retain information from previous requests.
- Request-response model: The client sends a request to the server, and the server responds with the requested data.
- Methods: HTTP uses various methods like GET, POST, PUT, DELETE to indicate the desired action to be performed on the resource.
- Port: By default, HTTP uses port 80 for communication.
- Security: HTTP is not secure by itself. For secure communication, HTTPS (HTTP Secure) is used, which encrypts the data.
- Versions: The most common versions are HTTP/1.1 and HTTP/2, with HTTP/3 gaining adoption.




### The structure:

- Request Line:

    - HTTP method (e.g., GET, POST, PUT, DELETE)
    - Request URI (Uniform Resource Identifier)
    - HTTP version

- Headers:

    - Key-value pairs providing additional information about the request
    - Common headers include Host, User-Agent, Accept, Content-Type, etc.

- Empty line:

    - Separates the headers from the body
    
- Request Body (optional):

    - Contains data sent to the server (e.g., form data in a POST request)

```HTTP
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```
In this example:

- The request line specifies a GET method, requesting "/index.html" using HTTP/1.1.
- Several headers provide additional information.
- There's no request body in this GET request.

# HTTP Request Methods

This README provides an overview of the main HTTP request methods, their uses, and examples.

## Table of Contents
1. [GET](#get)
2. [POST](#post)
3. [PUT](#put)
4. [DELETE](#delete)
5. [PATCH](#patch)
6. [HEAD](#head)
7. [OPTIONS](#options)
8. [TRACE](#trace)
9. [CONNECT](#connect)

## GET
- **Purpose**: Retrieve data from the server
- **Characteristics**: 
  - Should not modify server data
  - Parameters sent in URL
- **Example Use**: Fetching a webpage or API resource

## POST
- **Purpose**: Submit data to be processed by the server
- **Characteristics**:
  - Can modify server data
  - Data sent in request body
- **Example Use**: Submitting a form or creating a new resource

## PUT
- **Purpose**: Update an existing resource on the server
- **Characteristics**:
  - Replaces entire resource with submitted data
- **Example Use**: Updating a user's profile information

## DELETE
- **Purpose**: Request removal of a resource from the server
- **Example Use**: Deleting a user account or social media post

## PATCH
- **Purpose**: Partially modify an existing resource
- **Characteristics**:
  - Sends only data that needs updating, not entire resource
- **Example Use**: Updating a single field in a user profile

## HEAD
- **Purpose**: Retrieve only headers, not body
- **Characteristics**:
  - Similar to GET, but without body transfer
- **Example Use**: Checking if a resource has been modified

## OPTIONS
- **Purpose**: Describe communication options for target resource
- **Example Use**: Checking supported HTTP methods for a specific URL

## TRACE
- **Purpose**: Diagnostic purposes
- **Characteristics**:
  - Server returns received request
- **Example Use**: Debugging proxy servers

## CONNECT
- **Purpose**: Establish network connection to a resource
- **Example Use**: Setting up an SSL tunnel