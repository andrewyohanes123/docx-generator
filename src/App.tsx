import React, { useState, createRef, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap'
import TextBox, { alignType, TextBoxObj, alignment } from './components/TextBox';
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import 'bootstrap/dist/css/bootstrap.min.css'

export type TextObj = {
  text: string;
  reference: React.RefObject<HTMLTextAreaElement>;
  type: string;
  bold: boolean;
  align: alignType
}

export type TextObjCollection = TextObj[];

const doc = new Document({
  creator: 'Andrew',
  title: 'Word Testing',
  description: 'Some testing'
});

function App() {
  const [texts, setTexts] = useState<TextObjCollection>([{ text: '', reference: createRef<HTMLTextAreaElement>(), bold: false, align: 'left', type: 'text' }])
  const textRef = useRef<number>(0);

  useEffect(() => {
    textRef.current = texts.length;
  });

  useEffect(() => {
    texts[0].reference.current?.focus()
  }, []);

  useEffect(() => {
    //   const prevLength: number = textRef.current
    //   if (texts.length > prevLength) {
    texts[texts.length - 1].reference.current?.focus();
    //   }
    //   console.log(texts.length, { prevLength })
  }, [texts]);

  document.title = "Buat Docx"

  const setText = ({ value: text, align, type, bold }: TextBoxObj, index: number): void => {
    const newTexts = [...texts]
    newTexts[index] = { text, reference: newTexts[index].reference, align, type, bold };
    setTexts([...newTexts]);
  }

  const downloadWordFile = () => {
    doc.addSection({
      children: texts.map(({ text, type, align, bold }: TextObj) => (
        type === 'text' ?
          new Paragraph({
            children: [new TextRun({ text, size: 24, bold })],
            // break: true,
            thematicBreak: true,
            alignment: align === 'left' ? AlignmentType.LEFT : align === 'center' ? AlignmentType.CENTER : align === 'right' ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED
          })
          :
          new Paragraph({ text, heading: HeadingLevel.HEADING_1, alignment: align === 'left' ? AlignmentType.LEFT : align === 'center' ? AlignmentType.CENTER : align === 'right' ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED })
      ))
    })

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `document ${new Date().getTime()}.docx`);
    }).catch(e => console.log(e));
  }

  const newLine = (status: boolean): void => {
    if (status) {
      const newTexts = [...texts]
      const reference = createRef<HTMLTextAreaElement>();
      newTexts.push({ text: '', reference, bold: false, align: 'left', type: 'text' });
      reference.current?.focus();
      setTexts([...newTexts]);
    }
  }

  const removeLine = (index: number): void => {
    if (texts.length > 1) {
      const newTexts = [...texts];
      newTexts.splice(index, 1);
      setTexts([...newTexts]);
    }
  }

  return (
    <div className="p-2">
      <Button onClick={downloadWordFile} variant="primary">Word</Button>
      {
        texts.map(({ text, reference }: TextObj, i: number) => (
          <TextBox value={text} reference={reference} index={i} onDelete={() => removeLine(i)} onChange={text => setText(text, i)} key={i} onEnter={newLine} />
        ))
      }
    </div>
  );
}

export default App;
