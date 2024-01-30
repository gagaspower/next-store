import { Editor } from "@tinymce/tinymce-react";
import React, { FC } from "react";

type TEditor = {
  value: any;
  onChange: (c: any) => void;
  label?: string;
  classes?: string;
};

const TinyMce: FC<TEditor> = ({ value, onChange, label, classes }) => {
  return (
    <label className={`form-control w-full ${classes}`}>
      {label && (
        <div className="label">
          <span className="label-text font-poppins text-sm">{label} :</span>
        </div>
      )}
      <Editor
        id="#textarea"
        apiKey="0du7yld1ww84vxfsviif0avlx1xnwkep01rydnj9wobbxe2m"
        value={value}
        onEditorChange={(content, editor) => {
          onChange(content);
        }}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "table removeformat",
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap'); body { font-family: Poppins; }",
        }}
      />
    </label>
  );
};

export default TinyMce;
