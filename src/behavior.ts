"use strict";

import {
    BaseDataPoint,
    IBehaviorOptions,
    IInteractiveBehavior, IInteractivityService, ISelectionHandler
} from "powerbi-visuals-utils-interactivityutils/lib/interactivityBaseService";
import powerbi from "powerbi-visuals-api";

import {d3Selection, IBarVisual, VisualDataPoint} from "./visualInterfaces";
import * as visualUtils from './utils';
import {Visual} from "./visual";

import IVisualHost = powerbi.extensibility.visual.IVisualHost;

export interface WebBehaviorOptions extends IBehaviorOptions<BaseDataPoint> {
    bars: d3Selection<any>;
    clearCatcher: d3Selection<any>;
    interactivityService: IInteractivityService<VisualDataPoint>;
    selectionSaveSettings?: any;
    host: IVisualHost;
}

export class WebBehavior implements IInteractiveBehavior {
    private visual: IBarVisual;
    private options: WebBehaviorOptions;

    constructor(visual: IBarVisual) {
        this.visual = visual;
    }

    public bindEvents(options: WebBehaviorOptions, selectionHandler: ISelectionHandler) {
        this.options = options;
        this.visual.webBehaviorSelectionHandler = selectionHandler;
    }

    public renderSelection(hasSelection: boolean) {
        let hasHighlight = this.visual.getAllDataPoints().filter(x => x.highlight).length > 0;

        let allDatapoints: VisualDataPoint[] = this.visual.getAllDataPoints();
        //this.options.interactivityService.applySelectionStateToData(allDatapoints);
        let currentSelection = allDatapoints.filter(d => d.selected);

        this.options.bars.style(
            "fill-opacity", (p: VisualDataPoint) => visualUtils.getFillOpacity(
                p.selected,
                p.highlight,
                !p.highlight && hasSelection,
                !p.selected && hasHighlight))
            .style(
                "stroke", (p: VisualDataPoint) => {
                    if (hasSelection && visualUtils.isSelected(p.selected,
                        p.highlight,
                        !p.highlight && hasSelection,
                        !p.selected && hasHighlight)) {
                        return Visual.DefaultStrokeSelectionColor;
                    }

                    return p.color;
                })
            .style(
                "stroke-width", p => {
                    if (hasSelection && visualUtils.isSelected(p.selected,
                        p.highlight,
                        !p.highlight && hasSelection,
                        !p.selected && hasHighlight)) {
                        return Visual.DefaultStrokeSelectionWidth;
                    }

                    return Visual.DefaultStrokeWidth;
                });
    }
}
