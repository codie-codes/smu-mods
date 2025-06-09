export default function Custom404() {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <div className="mt-12">
          <div className="text-muted-foreground text-sm">
            <p>Error Code: 404</p>
          </div>
        </div>
      </div>
    </div>
  );
}
