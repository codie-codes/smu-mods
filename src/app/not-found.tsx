export default function Custom404() {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-primary mb-4 text-9xl font-bold">404</h1>
          <h2 className="text-foreground mb-2 text-2xl font-semibold">
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
