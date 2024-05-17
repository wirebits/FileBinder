# File Binder
# A tool which bind files into HTML and send anywhere.
# Author - WireBits

import os
import base64
import argparse

def bind_file_in_html(template_path, file_path, html_output_path):
    with open(file_path, 'rb') as f:
        file_content = f.read()
        encoded_content = base64.b64encode(file_content).decode('utf-8')
    
    original_filename = os.path.basename(file_path)

    with open(template_path, 'r') as template_file:
        html_template = template_file.read()
    
    download_link = f'<a href="data:application/octet-stream;base64,{encoded_content}" download="{original_filename}">Download File</a>'
    html_content = html_template.replace('{{DOWNLOAD_LINK}}', download_link)

    with open(html_output_path, 'w') as html_file:
        html_file.write(html_content)

def main():
    parser = argparse.ArgumentParser(description="A tool which bind files into HTML and send anywhere.")
    parser.add_argument("-i", "--input", required=True, help="Path to the input HTML template")
    parser.add_argument("-f", "--file", required=True, help="Path to the file to be converted")
    parser.add_argument("-o", "--output", required=True, help="Path to save the modified HTML output")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: The input HTML template '{args.input}' does not exist.")
        return
    if not os.path.exists(args.file):
        print(f"Error: The file '{args.file}' does not exist.")
        return

    bind_file_in_html(args.input, args.file, args.output)

if __name__ == "__main__":
    main()