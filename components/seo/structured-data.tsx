export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Hemanth Reddy Yarraguravagari",
          url: "https://hemanthyarraguravagari.xyz",
          sameAs: [
            "https://github.com/Hemanthreddy410",
            "https://linkedin.com/in/hemanth-reddy"
          ],
          jobTitle: "Software Engineer",
          knowsAbout: [
            "Data Engineering", 
            "ServiceNow Development", 
            "ETL/ELT Pipelines", 
            "Python", 
            "SQL", 
            "AWS", 
            "Data Warehousing"
          ],
          image: "/profile.jpg",
          description: "Software Engineer specializing in Data Engineering, ServiceNow Development, and ETL/ELT solutions.",
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Florida International University",
            location: "Miami, FL"
          },
          hasCredential: [
            {
              "@type": "EducationalOccupationalCredential",
              name: "ServiceNow Certified System Administrator"
            },
            {
              "@type": "EducationalOccupationalCredential",
              name: "ServiceNow Certified Application Developer"
            },
            {
              "@type": "EducationalOccupationalCredential",
              name: "AWS Certified Solutions Architect – Professional"
            }
          ]
        })
      }}
    />
  );
}