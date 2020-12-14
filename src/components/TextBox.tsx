import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, ButtonGroup, OverlayTrigger, Tooltip, FormControl, InputGroup } from 'react-bootstrap'
import { FiBold, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { FaAlignJustify, FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa";
import { AlignmentType } from 'docx'

export type TextBoxType = {
  value: string;
  defaultValue?: string;
  reference?: string | ((instance: HTMLTextAreaElement | null) => void) | React.RefObject<HTMLTextAreaElement> | null | undefined;
  index: number;
  onChange: (value: TextBoxObj) => void;
  onEnter: (status: boolean) => void;
  onDelete: () => void;
}

export type TextBoxObj = {
  value: string;
  align: alignType;
  type: string;
  bold: boolean
}

export type alignment = {
  left: AlignmentType.LEFT;
  right: AlignmentType.RIGHT;
  center: AlignmentType.CENTER;
  justify: AlignmentType.JUSTIFIED;
}

export type paragraphType = 'text' | 'heading';
export type headingType = 'HEADING_1' | 'HEADING_2' | 'HEADING_3';
export type alignType = 'left' | 'right' | 'center' | 'both'

export default function TextBox({ value, onChange, defaultValue, onEnter: onEnterType, reference, onDelete, index }: TextBoxType) {
  const [showTools, toggleShowTools] = useState<boolean>(false);
  const [bold, toggleBold] = useState<boolean>(false);
  const [align, setAlign] = useState<alignType>('left');
  const [focus, toggleFocus] = useState<boolean>(false);
  const [type, setType] = useState<string>('text');
  // const [headingType, setHeadingType] = useState<headingType>('HEADING_1');
  const [height, setHeight] = useState<string>('auto');
  const [fontSize, setFontSize] = useState<number>(12);

  useEffect(() => {
    onChange({ value, align, type, bold });
  }, [type, align, bold])

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const { shiftKey, key } = e;
    if (shiftKey && key === 'Enter') {
      onEnterType(false);
    } else if (key === 'Enter' && !shiftKey) {
      e.preventDefault()
      onEnterType(true);
    } else if (key === 'Backspace' && value.length === 0) {
      onDelete();
    }
    // console.log(key)
  }

  const text = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onChange({ value: e.target.value, align, type, bold });
    // @ts-ignore
    setHeight(`${reference.current!.scrollHeight}px`)
  }

  return (
    <>
      <Card className="overflow-hidden shadow-sm my-1" onMouseEnter={() => toggleShowTools(true)} onMouseLeave={() => toggleShowTools(focus)}>
        <textarea
          ref={reference}
          placeholder="Type"
          defaultValue={defaultValue}
          onChange={text}
          className="form-control rounded-0 border-0"
          value={value}
          rows={2}
          onKeyDown={onKeyPress}
          onFocus={() => toggleFocus(true)}
          onBlur={() => {
            toggleFocus(false);
            // toggleShowTools(false);
          }}
          style={{ height }}
        ></textarea>
        {(showTools) &&
          <Card.Body className="p-2 border-top">
            <Row className="justify-content-between align-items-center">
              <Col md={8}>
                <Row className="justify-content-start align-items-center">
                  {index > 0 &&
                    <Col md={2}>
                      <ButtonGroup>
                        <Button size="sm" variant="light"><FiChevronUp /></Button>
                        <Button size="sm" variant="light"><FiChevronDown /></Button>
                      </ButtonGroup>
                    </Col>
                  }
                  <Col md={2}>
                    <Button size="sm" disabled={index === 0} onClick={onDelete} variant="danger"><FiTrash2 /></Button>
                    &nbsp;
                    <Button size="sm" onClick={() => toggleBold(b => !b)} variant={bold ? "primary" : "secondary"}><FiBold /></Button>
                  </Col>
                  <Col md={3}>
                    <ButtonGroup>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="kiri">Teks rata kiri</Tooltip>}>
                        <Button size="sm" onClick={() => setAlign('left')} variant={align === 'left' ? "primary" : "light"} ><FaAlignLeft /></Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tengah">Teks rata tengah</Tooltip>}>
                        <Button size="sm" onClick={() => setAlign('center')} variant={align === 'center' ? "primary" : "light"} ><FaAlignCenter /></Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="kanan">Teks rata kanan</Tooltip>}>
                        <Button size="sm" onClick={() => setAlign('right')} variant={align === 'right' ? "primary" : "light"} ><FaAlignRight /></Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="kirikanan">Teks rata kanan kiri</Tooltip>}>
                        <Button size="sm" onClick={() => setAlign('both')} variant={align === 'both' ? "primary" : "light"} ><FaAlignJustify /></Button>
                      </OverlayTrigger>
                    </ButtonGroup>
                  </Col>
                  <Col md={3}>
                    <FormControl as="select" value={type} onChange={({ target: { value } }): void => setType(value)} size="sm" >
                      <option value="text">Text</option>
                      <option value="heading">Heading</option>
                    </FormControl>
                  </Col>
                  <Col md={3}>
                    <InputGroup>
                      <InputGroup.Prepend>Ukuran Font</InputGroup.Prepend>
                      <FormControl type="number" value={fontSize} onChange={({ target: { value } }): void => setFontSize(parseInt(value))} size="sm" />
                      <InputGroup.Append>px</InputGroup.Append >
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
              <Col md={2} className="text-right">
                <p className="text-secondary m-0">Tekan <code>Shift</code> + <code>Enter</code></p>
              </Col>
            </Row>
          </Card.Body>
        }
      </Card>
    </>
  )
}
