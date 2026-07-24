
import { Link } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

function PageHeader({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {buttonText && buttonLink && (
        <PrimaryButton to={buttonLink}>
  {buttonText}
</PrimaryButton>
      )}
    </div>
  );
}

export default PageHeader;