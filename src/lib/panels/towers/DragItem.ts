import type { Panel } from "../../Hanoi"

export type DragItem = {
    panel :Panel,
    from :Panel[]
}

export function dragFrom(from :Panel[]) :DragItem|undefined {
    const panel = from.pop();
    if (panel) {
        return {
            from,
            panel
        };
    } else {
        return;
    }
}

export function cancelDrag(di :DragItem) {
    di.from.push(di.panel);
}