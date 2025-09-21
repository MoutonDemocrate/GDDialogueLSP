// BBCode tag definition interface
export interface BBCodeTag {
  name: string;
  description: string;
  parameters?: {
    name: string;
    description: string;
    optional?: boolean;
  }[];
  example?: string;
  selfClosing?: boolean; // True for tags that don't need a closing tag
}

// Built-in Godot BBCode tags
export const builtinTags: BBCodeTag[] = [
  {
    name: 'b',
    description: 'Makes text use the bold (or bold italics) font of RichTextLabel.',
    example: '[b]This is bold text[/b]',
    selfClosing: false
  },
  {
    name: 'i',
    description: 'Makes text use the italics (or bold italics) font of RichTextLabel.',
    example: '[i]This is italic text[/i]',
    selfClosing: false
  },
  {
    name: 'u',
    description: 'Makes text underlined.',
    example: '[u]This is underlined text[/u]',
    selfClosing: false
  },
  {
    name: 's',
    description: 'Makes text strikethrough.',
    example: '[s]This is strikethrough text[/s]',
    selfClosing: false
  },
  {
    name: 'center',
    description: 'Makes text horizontally centered. Same as [p align=center].',
    example: '[center]This text is centered[/center]',
    selfClosing: false
  },
  {
    name: 'left',
    description: 'Makes text horizontally left-aligned. Same as [p align=left].',
    example: '[left]This text is left-aligned[/left]',
    selfClosing: false
  },
  {
    name: 'right',
    description: 'Makes text horizontally right-aligned. Same as [p align=right].',
    example: '[right]This text is right-aligned[/right]',
    selfClosing: false
  },
  {
    name: 'fill',
    description: 'Makes text fill the full width of RichTextLabel. Same as [p align=fill].',
    example: '[fill]This text fills its container[/fill]',
    selfClosing: false
  },
  {
    name: 'indent',
    description: 'Indents text once. The indentation width is the same as with [ul] or [ol], but without a bullet point.',
    example: '[indent]This text is indented[/indent]',
    selfClosing: false
  },
  {
    name: 'url',
    description: 'Creates a hyperlink (underlined and clickable text). Must be handled with the "meta_clicked" signal to have an effect.',
    parameters: [{
      name: 'url',
      description: 'The URL to link to',
      optional: true
    }],
    example: '[url=https://example.com]Link text[/url]',
    selfClosing: false
  },
  {
    name: 'hint',
    description: 'Creates a tooltip hint that is displayed when hovering the text with the mouse.',
    parameters: [{
      name: 'text',
      description: 'The tooltip text to display on hover. Recommended to put between quotes.'
    }],
    example: '[hint="Tooltip text displayed on hover"]Text with tooltip[/hint]',
    selfClosing: false
  },
  {
    name: 'color',
    description: 'Changes the color of text. Color must be provided by a common name or using the HEX format (e.g. #ff00ff).',
    parameters: [{
      name: 'color',
      description: 'Color name or color in HEX format'
    }],
    example: '[color=red]This is red text[/color]',
    selfClosing: false
  },
  {
    name: 'bgcolor',
    description: 'Draws the color behind text. This can be used to highlight text.',
    parameters: [{
      name: 'color',
      description: 'Color name or color in HEX format'
    }],
    example: '[bgcolor=yellow]This is highlighted text[/bgcolor]',
    selfClosing: false
  },
  {
    name: 'fgcolor',
    description: 'Draws the color in front of text. This can be used to "redact" text.',
    parameters: [{
      name: 'color',
      description: 'Color name or color in HEX format'
    }],
    example: '[fgcolor=black]This is redacted text[/fgcolor]',
    selfClosing: false
  },
  {
    name: 'font',
    description: 'Makes text use a font resource from the specified path.',
    parameters: [{
      name: 'name',
      description: 'A valid Font resource path'
    }],
    example: '[font=path/to/font.ttf]Text in different font[/font]',
    selfClosing: false
  },
  {
    name: 'font_size',
    description: 'Use custom font size for text.',
    parameters: [{
      name: 'size',
      description: 'Font size in pixels'
    }],
    example: '[font_size=24]Larger text[/font_size]',
    selfClosing: false
  },
  {
    name: 'opentype_features',
    description: 'Enables custom OpenType font features for text.',
    parameters: [{
      name: 'features',
      description: 'Comma-separated list of OpenType feature tags'
    }],
    example: '[opentype_features=calt=0,zero=1]Text with OpenType features[/opentype_features]',
    selfClosing: false
  },
  {
    name: 'table',
    description: 'Creates a table with the specified number of columns.',
    parameters: [
      {
        name: 'columns',
        description: 'Number of columns'
      },
      {
        name: 'valign',
        description: 'Vertical alignment (top/center/bottom/baseline)',
        optional: true
      }
    ],
    example: '[table=2]\n[cell]Col1[/cell][cell]Col2[/cell]\n[/table]',
    selfClosing: false
  },
  {
    name: 'cell',
    description: 'Defines a table cell.',
    parameters: [{
      name: 'ratio',
      description: 'Cell expansion ratio',
      optional: true
    }],
    example: '[cell]Cell content[/cell]',
    selfClosing: false
  },
  {
    name: 'ul',
    description: 'Adds an unordered list.',
    parameters: [{
      name: 'bullet',
      description: 'Custom bullet point character',
      optional: true
    }],
    example: '[ul]\nItem 1\nItem 2\n[/ul]',
    selfClosing: false
  },
  {
    name: 'ol',
    description: 'Adds an ordered (numbered) list.',
    parameters: [{
      name: 'type',
      description: '1 for numbers, a/A for letters, i/I for Roman numerals',
      optional: true
    }],
    example: '[ol type=1]\nItem 1\nItem 2\n[/ol]',
    selfClosing: false
  },
  {
    name: 'p',
    description: 'Adds new paragraph with text.',
    parameters: [{
      name: 'align',
      description: 'left/l, center/c, right/r, fill/f',
      optional: true
    }],
    example: '[p align=center]Centered paragraph[/p]',
    selfClosing: false
  },
  {
    name: 'code',
    description: 'Makes text use the mono font of RichTextLabel.',
    example: '[code]Monospace text[/code]',
    selfClosing: false
  },
  // Self-closing tags
  {
    name: 'br',
    description: 'Adds line break in text, without adding a new paragraph.',
    example: 'Line 1[br]Line 2',
    selfClosing: true
  },
  {
    name: 'lb',
    description: 'Adds [. Used to escape BBCode markup.',
    example: '[lb]b[rb]text[lb]/b[rb] will display as [b]text[/b]',
    selfClosing: true
  },
  {
    name: 'rb',
    description: 'Adds ]. Used to escape BBCode markup.',
    example: '[lb]b[rb]text[lb]/b[rb] will display as [b]text[/b]',
    selfClosing: true
  },
  {
    name: 'hr',
    description: 'Adds a horizontal rule to separate content.',
    parameters: [
      {
        name: 'color',
        description: 'Color name or color in HEX format',
        optional: true
      },
      {
        name: 'height',
        description: 'Height in pixels',
        optional: true
      },
      {
        name: 'width',
        description: 'Width in pixels or percentage',
        optional: true
      }
    ],
    example: '[hr color=red width=50%]',
    selfClosing: true
  }
];

// Text effect tags
export const effectTags: BBCodeTag[] = [
  {
    name: 'wave',
    description: 'Makes the text go up and down.',
    parameters: [
      {
        name: 'amp',
        description: 'Controls how high and low the effect goes',
        optional: true
      },
      {
        name: 'freq',
        description: 'Controls how fast the text goes up and down',
        optional: true
      },
      {
        name: 'connected',
        description: 'If 1, glyphs with ligatures move together. If 0, each glyph moves individually',
        optional: true
      }
    ],
    example: '[wave amp=50.0 freq=5.0]Wavy text[/wave]',
    selfClosing: false
  },
  {
    name: 'tornado',
    description: 'Makes the text move around in a circle.',
    parameters: [
      {
        name: 'radius',
        description: 'Radius of the circle that controls the offset',
        optional: true
      },
      {
        name: 'freq',
        description: 'How fast the text moves in a circle',
        optional: true
      },
      {
        name: 'connected',
        description: 'If 1, glyphs with ligatures move together. If 0, each glyph moves individually',
        optional: true
      }
    ],
    example: '[tornado radius=10.0 freq=1.0]Spinning text[/tornado]',
    selfClosing: false
  },
  {
    name: 'shake',
    description: 'Makes the text shake.',
    parameters: [
      {
        name: 'rate',
        description: 'Controls how fast the text shakes',
        optional: true
      },
      {
        name: 'level',
        description: 'Controls how far the text is offset from the origin',
        optional: true
      },
      {
        name: 'connected',
        description: 'If 1, glyphs with ligatures move together. If 0, each glyph moves individually',
        optional: true
      }
    ],
    example: '[shake rate=20.0 level=5]Shaking text[/shake]',
    selfClosing: false
  },
  {
    name: 'pulse',
    description: "Creates an animated pulsing effect that multiplies each character's opacity and color.",
    parameters: [
      {
        name: 'freq',
        description: 'Controls the frequency of the half-pulsing cycle',
        optional: true
      },
      {
        name: 'color',
        description: 'Target color multiplier for blinking',
        optional: true
      },
      {
        name: 'ease',
        description: 'Easing function exponent to use. Negative values provide in-out easing',
        optional: true
      }
    ],
    example: '[pulse freq=1.0 color=#ffffff40]Pulsing text[/pulse]',
    selfClosing: false
  },
  {
    name: 'rainbow',
    description: 'Gives the text a rainbow color that changes over time.',
    parameters: [
      {
        name: 'freq',
        description: 'How many letters the rainbow extends over before repeating',
        optional: true
      },
      {
        name: 'sat',
        description: 'Rainbow saturation',
        optional: true
      },
      {
        name: 'val',
        description: 'Rainbow value/brightness',
        optional: true
      },
      {
        name: 'speed',
        description: 'Number of full rainbow cycles per second',
        optional: true
      }
    ],
    example: '[rainbow freq=1.0 sat=0.8 val=0.8]Rainbow text[/rainbow]',
    selfClosing: false
  },
  {
    name: 'fade',
    description: "Creates a static fade effect that multiplies each character's opacity.",
    parameters: [
      {
        name: 'start',
        description: 'Starting position of the falloff',
        optional: true
      },
      {
        name: 'length',
        description: 'Over how many characters the fade out should take place',
        optional: true
      }
    ],
    example: '[fade start=4 length=14]Fading text[/fade]',
    selfClosing: false
  }
];

// DialogueManager specific BBCode tags
export const dialogueManagerTags: BBCodeTag[] = [
  {
    name: 'wait',
    description: 'Pauses typing of dialogue.',
    parameters: [{
      name: 'duration',
      description: 'Either:\n- A number of seconds to wait\n- An input action name in quotes (e.g. "ui_accept")\n- An array of action names (e.g. ["ui_accept","ui_cancel"])\n- No value to wait for any action',
      optional: true
    }],
    example: 'Hello[wait=1.0]... world!\nPress any key to continue[wait]\nPress accept[wait="ui_accept"]\nPress accept or cancel[wait=["ui_accept","ui_cancel"]]',
    selfClosing: true
  },
  {
    name: 'speed',
    description: 'Changes the typing speed by multiplying the default speed.',
    parameters: [{
      name: 'multiplier',
      description: 'Number to multiply the default typing speed by (e.g. 0.5 for half speed, 2.0 for double speed)'
    }],
    example: '[speed=0.5]Slow text \n[speed=2.0]Fast text',
    selfClosing: true
  },
  {
    name: 'next',
    description: 'Controls automatic continuation to the next line of dialogue.',
    parameters: [{
      name: 'duration',
      description: 'Either:\n- A number of seconds to wait before continuing\n- "auto" to wait based on text length',
      optional: true
    }],
    example: 'This line will wait 2 seconds[next=2]\nThis line will wait based on length[next=auto]\nThis line immediately advance at the end[next=0]',
    selfClosing: true
  }
];

// Helper function to convert a BBCodeTag to markdown documentation
export function tagToMarkdown(tag: BBCodeTag): string {
  let md = `**[${tag.name}]** - ${tag.description}\n\n`;
  
  if (tag.parameters && tag.parameters.length > 0) {
    md += '**Parameters:**\n';
    for (const param of tag.parameters) {
      md += `- \`${param.name}\`${param.optional ? ' (optional)' : ''}: ${param.description}\n`;
    }
    md += '\n';
  }
  
  if (tag.example) {
    md += '**Example:**\n```\n' + tag.example + '\n```\n';
  }
  
  return md;
}

// Get all valid tag names
export function getAllTagNames(): string[] {
  return [...builtinTags, ...dialogueManagerTags, ...effectTags].map(tag => tag.name);
}

// Helper to find a tag by name from builtin, dialogue manager, or effect tags
export function findTag(name: string): BBCodeTag | undefined {
  return [...builtinTags, ...dialogueManagerTags, ...effectTags].find(tag => tag.name === name);
}

// Check if a tag name is valid
export function isValidTag(name: string): boolean {
  return getAllTagNames().includes(name);
}
