import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection, HealthCheckRatingOption, SelectField } from "../AddPatientModal/FormField";
import { HealthCheckEntry, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

/*
 * use type Entry, but omit id
 */
export type EntryFormValuesHealthCheck = Omit<HealthCheckEntry, "id">;

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low risk" },
  { value: HealthCheckRating.HighRisk, label: "High risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical risk" },
];

interface Props {
  onSubmit: (values: EntryFormValuesHealthCheck) => void;
  onCancel: () => void;
}

const AddHealthCheckEntryForm = ({ onSubmit, onCancel }: Props) => {
    const [{ diagnoses }] = useStateValue();
  
    return (
      <Formik
        initialValues={{
            description: "",
            date: new Date().toISOString().split('T')[0],
            specialist: "",
            diagnosisCodes: [],
            type: "HealthCheck",
            healthCheckRating: HealthCheckRating.Healthy
        }}
        onSubmit={onSubmit}
        validate={(values) => {
          const requiredError = "Field is required";
          
          const errors: { [field: string]: string | {[field: string]: string}} = {};
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.date) {
            errors.date = requiredError;
          }
          if (values.date && !isDate(values.date)) {
            errors.date = "Invalid date (yyyy-MM-dd).";
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.healthCheckRating && values.healthCheckRating != 0) {
            errors.healthCheckRating = requiredError;
          }

          return errors;
        }}
      >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
  
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <SelectField label="Health check rating" name="healthCheckRating" options={healthCheckRatingOptions} />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />    
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
    );
  };

  export default AddHealthCheckEntryForm;