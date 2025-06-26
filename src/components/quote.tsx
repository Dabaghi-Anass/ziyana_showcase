export function QuoteSvg({
  size = 64,
  isClosing = false,
}: {
  size?: number;
  isClosing?: boolean;
}) {
  return (
    <img
      src='src/assets/svgs/quote.svg'
      width={size}
      height={size}
      style={{ padding: '.3rem', transform: isClosing ? 'scaleX(-1)' : 'none' }}
      alt='quote'
    />
  );
}
