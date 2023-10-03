export declare type GravyBinderConfig = {
    precomputeBindings?: boolean;
};
export declare class GravyBinder {
    protected config?: GravyBinderConfig | undefined;
    protected root: Element | Document;
    protected scope: any;
    constructor(scope?: any, root?: HTMLElement, config?: GravyBinderConfig | undefined);
    private outwardBindingActions;
    private appliedBindings;
    private loopByQuery;
    protected setDynamic: <TValue>(property: string, value: TValue) => void;
    protected getDynamic: <TValue>(property: string) => TValue;
    protected compileGetter: (property: string) => Function;
    updateInputBindings: () => void;
    private applyClassConditionally;
    updateBindings: () => void;
    updateOutwardBindings: () => void;
    private bindInputEvents;
    private initializeListener;
    scanBindings: () => void;
    private initialize;
    registerOutwardBinding: (dataAttribute: string, bindingAction: (node: any, value: any) => void) => void;
    private registerDefaultOutwardBindings;
    private toCamelCase;
}
