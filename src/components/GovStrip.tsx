import Image from "next/image";

export default function GovStrip() {
  return (
    <div className="gov-strip">
      <div className="gov-strip-inner">
        <Image
          src="/assets/strip-mark.png"
          alt=""
          width={16}
          height={11}
          className="gov-strip-mark"
        />
        <span className="gov-strip-text">Placeholder strip text — edit me</span>
      </div>
    </div>
  );
}
