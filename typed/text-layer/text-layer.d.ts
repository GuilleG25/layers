import { CompositeLayer } from '@deck.gl/core/typed';
import MultiIconLayer from './multi-icon-layer/multi-icon-layer';
import FontAtlasManager from './font-atlas-manager';
import TextBackgroundLayer from './text-background-layer/text-background-layer';
import type { FontSettings } from './font-atlas-manager';
import type { LayerProps, LayerDataSource, Accessor, AccessorFunction, Unit, Position, Color, UpdateParameters, GetPickingInfoParams, PickingInfo, DefaultProps } from '@deck.gl/core/typed';
declare type _TextLayerProps<DataT> = {
    data: LayerDataSource<DataT>;
    /** If `true`, the text always faces camera. Otherwise the text faces up (z).
     * @default true
     */
    billboard?: boolean;
    /**
     * Text size multiplier.
     * @default 1
     */
    sizeScale?: number;
    /**
     * The units of the size, one of `'meters'`, `'common'`, and `'pixels'`.
     * @default 'pixels'
     */
    sizeUnits?: Unit;
    /**
     * The minimum size in pixels. When using non-pixel `sizeUnits`, this prop can be used to prevent the icon from getting too small when zoomed out.
     * @default 0
     */
    sizeMinPixels?: number;
    /**
     * The maximum size in pixels. When using non-pixel `sizeUnits`, this prop can be used to prevent the icon from getting too big when zoomed in.
     * @default Number.MAX_SAFE_INTEGER
     */
    sizeMaxPixels?: number;
    /** Whether to render background for the text blocks.
     * @default false
     */
    background?: boolean;
    /** Background color accessor.
     * @default [255, 255, 255, 255]
     */
    getBackgroundColor?: Accessor<DataT, Color>;
    /** Border color accessor.
     * @default [0, 0, 0, 255]
     */
    getBorderColor?: Accessor<DataT, Color>;
    /** Border width accessor.
     * @default 0
     */
    getBorderWidth?: Accessor<DataT, number>;
    /**
     * The padding of the background..
     * If an array of 2 is supplied, it is interpreted as `[padding_x, padding_y]` in pixels.
     * If an array of 4 is supplied, it is interpreted as `[padding_left, padding_top, padding_right, padding_bottom]` in pixels.
     * @default [0, 0, 0, 0]
     */
    backgroundPadding?: [number, number] | [number, number, number, number];
    /**
     * Specifies a list of characters to include in the font. If set to 'auto', will be automatically generated from the data set.
     * @default (ASCII characters 32-128)
     */
    characterSet?: FontSettings['characterSet'] | 'auto';
    /** CSS font family
     * @default 'Monaco, monospace'
     */
    fontFamily?: FontSettings['fontFamily'];
    /** CSS font weight
     * @default 'normal'
     */
    fontWeight?: FontSettings['fontWeight'];
    /** A unitless number that will be multiplied with the current text size to set the line height.
     * @default 'normal'
     */
    lineHeight?: number;
    /**
     * Width of outline around the text, relative to the text size. Only effective if `fontSettings.sdf` is `true`.
     * @default 0
     */
    outlineWidth?: number;
    /**
     * Color of outline around the text, in `[r, g, b, [a]]`. Each channel is a number between 0-255 and `a` is 255 if not supplied.
     * @default [0, 0, 0, 255]
     */
    outlineColor?: Color;
    /**
     * Advance options for fine tuning the appearance and performance of the generated shared `fontAtlas`.
     */
    fontSettings?: FontSettings;
    /**
     * Available options are `break-all` and `break-word`. A valid `maxWidth` has to be provided to use `wordBreak`.
     * @default 'break-word'
     */
    wordBreak?: 'break-word' | 'break-all';
    /**
     * A unitless number that will be multiplied with the current text size to set the width limit of a string.
     * If specified, when the text is longer than the width limit, it will be wrapped into multiple lines using
     * the strategy of `wordBreak`.
     * @default -1
     */
    maxWidth?: number;
    /**
     * Label text accessor
     */
    getText?: AccessorFunction<DataT, string>;
    /**
     * Anchor position accessor
     */
    getPosition?: Accessor<DataT, Position>;
    /**
     * Label color accessor
     * @default [0, 0, 0, 255]
     */
    getColor?: Accessor<DataT, Color>;
    /**
     * Label size accessor
     * @default 32
     */
    getSize?: Accessor<DataT, number>;
    /**
     * Label rotation accessor, in degrees
     * @default 0
     */
    getAngle?: Accessor<DataT, number>;
    /**
     * Horizontal alignment accessor
     * @default 'middle'
     */
    getTextAnchor?: Accessor<DataT, 'start' | 'middle' | 'end'>;
    /**
     * Vertical alignment accessor
     * @default 'center'
     */
    getAlignmentBaseline?: Accessor<DataT, 'top' | 'center' | 'bottom'>;
    /**
     * Label offset from the anchor position, [x, y] in pixels
     * @default [0, 0]
     */
    getPixelOffset?: Accessor<DataT, [number, number]>;
    /**
     * @deprecated Use `background` and `getBackgroundColor` instead
     */
    backgroundColor?: Color;
};
export declare type TextLayerProps<DataT = any> = _TextLayerProps<DataT> & LayerProps;
/** Render text labels at given coordinates. */
export default class TextLayer<DataT = any, ExtraPropsT extends {} = {}> extends CompositeLayer<ExtraPropsT & Required<_TextLayerProps<DataT>>> {
    static defaultProps: DefaultProps<TextLayerProps<any>>;
    static layerName: string;
    state: {
        styleVersion: number;
        fontAtlasManager: FontAtlasManager;
        characterSet?: Set<string>;
        startIndices?: number[];
        numInstances?: number;
        getText?: AccessorFunction<DataT, string>;
    };
    initializeState(): void;
    updateState(params: UpdateParameters<this>): void;
    getPickingInfo({ info }: GetPickingInfoParams): PickingInfo;
    /** Returns true if font has changed */
    private _updateFontAtlas;
    private _updateText;
    /** There are two size systems in this layer:
  
      + Pixel size: user-specified text size, via getSize, sizeScale, sizeUnits etc.
        The layer roughly matches the output of the layer to CSS pixels, e.g. getSize: 12, sizeScale: 2
        in layer props is roughly equivalent to font-size: 24px in CSS.
      + Texture size: internally, character positions in a text blob are calculated using the sizes of iconMapping,
        which depends on how large each character is drawn into the font atlas. This is controlled by
        fontSettings.fontSize (default 64) and most users do not set it manually.
        These numbers are intended to be used in the vertex shader and never to be exposed to the end user.
      
      All surfaces exposed to the user should either use the pixel size or a multiplier relative to the pixel size. */
    /** Calculate the size and position of each character in a text string.
     * Values are in texture size */
    private transformParagraph;
    /** Returns the x, y, width, height of each text string, relative to pixel size.
     * Used to render the background.
     */
    private getBoundingRect;
    /** Returns the x, y offsets of each character in a text string, in texture size.
     * Used to layout characters in the vertex shader.
     */
    private getIconOffsets;
    renderLayers(): (false | TextBackgroundLayer<any, {}> | MultiIconLayer<unknown, {}>)[];
    static set fontAtlasCacheLimit(limit: number);
}
export {};
//# sourceMappingURL=text-layer.d.ts.map