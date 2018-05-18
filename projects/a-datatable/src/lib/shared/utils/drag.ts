export type MoveHandler = (event: MouseEvent, dx: number, dy: number, x: number, y: number) => void;
export type UpHandler = (event: MouseEvent, x: number, y: number, moved: boolean) => void;

export function drag(event: MouseEvent, { move: move, up: up}: {move: MoveHandler, up?: UpHandler}) {

    const startX = event.pageX;
    const startY = event.pageY;
    let x = startX;
    let y = startY;
    let moved = false;

    // tslint:disable-next-line:no-shadowed-variable
    function mouseMoveHandler(event: MouseEvent) {
        const dx = event.pageX - x;
        const dy = event.pageY  - y;
        x = event.pageX;
        y = event.pageY;
        if (dx || dy) {
            moved = true;
        }

        move(event, dx, dy, x, y);

        event.preventDefault(); // to avoid text selection
    }

    // tslint:disable-next-line:no-shadowed-variable
    function mouseUpHandler(event: MouseEvent) {
        x = event.pageX;
        y = event.pageY;

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        if (up) {
            up(event, x, y, moved);
        }
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}
